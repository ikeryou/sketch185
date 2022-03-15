import { Func } from '../core/func';
import { Canvas } from '../webgl/canvas';
import { Object3D } from 'three/src/core/Object3D';
import { Conf } from '../core/conf';
import { Color } from "three/src/math/Color";
import { SphereGeometry } from "three/src/geometries/SphereGeometry";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { Mesh } from 'three/src/objects/Mesh';
import { Util } from '../libs/util';
import { Mouse } from '../core/mouse';

export class Con extends Canvas {

  private _con: Object3D;
  private _ball:Mesh;
  private _textList:Array<string> = []

  constructor(opt: any) {
    super(opt);

    this._con = new Object3D()
    this.mainScene.add(this._con)

    // 表示に使うテキスト入れておく
    this._textList = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')

    this._ball = new Mesh(
      new SphereGeometry(0.5, 64, 64),
      new MeshBasicMaterial({
        color:0xff0000,
        transparent:true
      })
    )
    this._con.add(this._ball)

    //console.log('%cSKETCH.181', 'border:5px solid #0000FF;border-radius:0px;padding:20px;color:#FFF;font-size:30px;')

    this._resize()
  }


  protected _update(): void {
    super._update()
    this._con.position.y = Func.instance.screenOffsetY() * -1

    const sw = Func.instance.sw()
    const sh = Func.instance.sh()

    const scale = Util.instance.map(Math.sin(this._c * 0.1), 0.2, 1, -1, 1)

    let mx = (Mouse.instance.easeNormal.x + 1) * 0.5
    const col = new Color(0xffffff)

    const isStart = true
    let text = ''
    const textNum = 140
    const x = Util.instance.map(mx, 0, 1, 0, 1)
    const range = Util.instance.map(scale, 0.02, 0.2, 0.2, 1)
    for(let i = 0; i < textNum; i++) {
      const key = (this._c + i) % (this._textList.length - 1)
      const per = i / textNum
      if(isStart && Math.abs(per - x) < range) {
        text += ' '
      } else {
        text += this._textList[key]
      }
    }
    console.log('%c' + text, 'font-weight:normal; color:#' + col.getHexString() + ';font-size:12px;background-color:#000;')

    // ボール
    let ballScale = sh * 0.3
    ballScale *= scale * 2
    this._ball.scale.set(ballScale, ballScale, ballScale)
    this._ball.position.x = Util.instance.map(mx, -sw * 0.5, sw * 0.5, 0, 1);
    this._ball.position.y = 0;
    (this._ball.material as MeshBasicMaterial).color = col

    if (this.isNowRenderFrame()) {
      this._render()
    }
  }


  private _render(): void {
    const bgColor = 0x000000
    this.renderer.setClearColor(bgColor, 1)
    this.renderer.render(this.mainScene, this.camera)
  }


  public isNowRenderFrame(): boolean {
    return this.isRender
  }


  _resize(isRender: boolean = true): void {
    super._resize();

    const w = Func.instance.sw();
    const h = Func.instance.sh();

    if(Conf.instance.IS_SP || Conf.instance.IS_TAB) {
      if(w == this.renderSize.width && this.renderSize.height * 2 > h) {
        return
      }
    }

    this.renderSize.width = w;
    this.renderSize.height = h;

    this.updateCamera(this.camera, w, h);

    let pixelRatio: number = window.devicePixelRatio || 1;

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(w, h);
    this.renderer.clear();

    if (isRender) {
      this._render();
    }
  }
}
