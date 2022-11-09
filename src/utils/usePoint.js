
import * as Cesium from 'cesium'

export function useBlankPoint (id) {
  const entityBlankPoint = new Cesium.Entity({
    id,
    position: null,
    point: {
      color: Cesium.Color.RED,
      pixelSize: 10,
      //   outlineColor: Cesium.Color.YELLOW,
      //   outlineWidth: 2,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    },
    label: {
      font: '16px sans-serif',
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      verticalOrigin: Cesium.VerticalOrigin.BASELINE,
      pixelOffset: new Cesium.Cartesian2(0, -15),
      disableDepthTestDistance: Number.POSITIVE_INFINITY // draws the label in front of terrain
    }
  })

  return entityBlankPoint
}
