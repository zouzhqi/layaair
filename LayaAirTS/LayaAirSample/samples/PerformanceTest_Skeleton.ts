/// <reference path="../../libs/LayaAir.d.ts" />
module laya {
    import Templet = laya.ani.bone.Templet;
    import Skeleton = laya.ani.bone.Skeleton;
    import Event = laya.events.Event;
    import GlowFilter = laya.filters.GlowFilter;
    import Loader = laya.net.Loader;
    import Texture = laya.resource.Texture;
    import Browser = laya.utils.Browser;
    import Handler = laya.utils.Handler;
    import Stat = laya.utils.Stat;
    import WebGL = laya.webgl.WebGL;

    export class PerformanceTest_Skeleton {
        private mArmature: Skeleton;
        //private fileName:string = "man";
        //private fileName:string = "skeleton";
        private fileName: string = "Dragon";
        private mTexturePath: string;
        private mAniPath: string;

        private rowCount: number = 10;
        private colCount: number = 10;
        private xOff: number = 50;
        private yOff: number = 100;
        private mSpacingX: number;
        private mSpacingY: number;

        private mAnimationArray: Array<Skeleton> = [];

        private mFactory: Templet;

        constructor() {
            this.mSpacingX = Browser.width / this.colCount;
            this.mSpacingY = Browser.height / this.rowCount;

            Laya.init(Browser.width, Browser.height, WebGL);
            Stat.show();

            this.mTexturePath = "res/skeleton/" + this.fileName + "/texture.png";
            this.mAniPath = "res/skeleton/" + this.fileName + "/" + this.fileName + ".bin";
            Laya.loader.load([{ url: this.mTexturePath, type: Loader.IMAGE }, { url: this.mAniPath, type: Loader.BUFFER }], Handler.create(this, this.onAssetsLoaded));
        }

        public onAssetsLoaded(): void {
            var tTexture: Texture = Loader.getRes(this.mTexturePath);
            var arraybuffer: ArrayBuffer = Loader.getRes(this.mAniPath);
            this.mFactory = new Templet();
            this.mFactory.on(Event.COMPLETE, this, this.parseComplete);
            this.mFactory.parseData(tTexture, arraybuffer, 10);
        }

        private parseComplete(): void {
            for (var i: number = 0; i < this.rowCount; i++) {
                for (var j: number = 0; j < this.colCount; j++) {
                    this.mArmature = this.mFactory.buildArmature();
                    this.mArmature.scaleX = this.mArmature.scaleY = 0.2;
                    this.mArmature.x = this.xOff + j * this.mSpacingX;
                    this.mArmature.y = this.yOff + i * this.mSpacingY;
                    this.mAnimationArray.push(this.mArmature);
                    Laya.stage.addChild(this.mArmature);
                }
            }
            Laya.stage.on(Event.CLICK, this, this.toggleAction);
        }

        private mActionIndex: number = 0;

        public toggleAction(e: any): void {
            this.mActionIndex++;
            var tAnimNum: number = this.mArmature.getAnimNum();
            if (this.mActionIndex >= tAnimNum) {
                this.mActionIndex = 0;
            }
            for (var i: number = 0, n: number = this.mAnimationArray.length; i < n; i++) {
                this.mAnimationArray[i].gotoAndPlayByIndex(this.mActionIndex);
            }
        }
    }
}
new laya.PerformanceTest_Skeleton();