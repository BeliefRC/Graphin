import React from 'react';

import { GraphinContext, G6 } from '@antv/graphin';

const defaultOptions = {
  r: 249,
  scaleRByWheel: true,
  minR: 100,
  maxR: 500,
  /**
   * @description 放大镜样式
   */
  delegateStyle: {
    stroke: '#000',
    strokeOpacity: 0.8,
    lineWidth: 2,
    fillOpacity: 0.1,
    fill: '#ccc',
  },
  // showLabel: true,
};
export interface FishEyeProps {
  /**
   * @description 是否开启
   * @default false
   */
  visible: boolean;
  /**
   * @description FishEye的配置项
   * @default { r: 249,scaleRByWheel: true,minR: 100,maxR: 500 }
   */
  options?: Partial<typeof defaultOptions>;
  /**
   * @description 监听用户按下 ESC 键的回调函数
   * @default ()=>{}
   */
  handleEscListener?: () => void;
}

const FishEye: React.FunctionComponent<FishEyeProps> = (props) => {
  const { graph } = React.useContext(GraphinContext);
  const { options, visible, handleEscListener } = props;

  React.useEffect(() => {
    const FishEyeOptions = {
      ...defaultOptions,
      ...options,
    };
    const fishEye = new G6.Fisheye(FishEyeOptions);
    const escListener = (e) => {
      if (e.keyCode === 27) {
        if (handleEscListener) {
          handleEscListener();
          graph.get('canvas').setCursor('default');
        }
      }
    };

    if (visible) {
      graph.addPlugin(fishEye);
      graph.get('canvas').setCursor('zoom-in');
    }

    if (handleEscListener) {
      window.addEventListener('keydown', escListener);
    }
    return () => {
      graph.get('canvas').setCursor('default');
      graph.removePlugin(fishEye);
      if (handleEscListener) {
        window.removeEventListener('keydown', escListener);
      }
    };
  }, [options, visible, handleEscListener]);

  return null;
};

export default FishEye;