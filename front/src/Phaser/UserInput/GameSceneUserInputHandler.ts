import type { UserInputHandlerInterface } from "../../Interfaces/UserInputHandlerInterface";
import type { GameScene } from "../Game/GameScene";

export class GameSceneUserInputHandler implements UserInputHandlerInterface {
    private gameScene: GameScene;

    constructor(gameScene: GameScene) {
        this.gameScene = gameScene;
    }

    public handleMouseWheelEvent(
        pointer: Phaser.Input.Pointer,
        gameObjects: Phaser.GameObjects.GameObject[],
        deltaX: number,
        deltaY: number,
        deltaZ: number
    ): void {
        this.gameScene.zoomByFactor(1 - (deltaY / 53) * 0.1);
    }

    public handlePointerUpEvent(pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[]): void {
        const camera = this.gameScene.getCameraManager().getCamera();
        const index = this.gameScene
            .getGameMap()
            .getTileIndexAt(pointer.x + camera.scrollX, pointer.y + camera.scrollY);
        const startTile = this.gameScene
            .getGameMap()
            .getTileIndexAt(this.gameScene.CurrentPlayer.x, this.gameScene.CurrentPlayer.y);
        this.gameScene
            .getPathfindingManager()
            .findPath(startTile, index)
            .then((path) => {
                const tileDimensions = this.gameScene.getGameMap().getTileDimensions();
                const pixelPath = path.map((step) => {
                    return { x: step.x * tileDimensions.width, y: step.y * tileDimensions.height };
                });
                this.gameScene.CurrentPlayer.setPathToFollow([...pixelPath]);
                console.log(pixelPath);
            })
            .catch((reason) => {
                console.log(reason);
            });
    }

    public handleSpaceKeyUpEvent(event: Event): Event {
        this.gameScene.activateOutlinedItem();
        return event;
    }
}