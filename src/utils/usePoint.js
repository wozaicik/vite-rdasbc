
import * as Cesium from 'cesium'

export function useBlankPoint (id) {
  const entityBlankPoint = new Cesium.Entity({
    id,
    position: null,
    billboard: {
      image: '/src/assets/icon/ylw-pushpin.png',
      scale: 0.5,
      color: Cesium.Color.WHITE, // default: WHITE
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    },
    label: {
      font: '16px sans-serif',
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      fillColor: Cesium.Color.WHITE,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      verticalOrigin: Cesium.VerticalOrigin.BASELINE,
      pixelOffset: new Cesium.Cartesian2(0, -28),
      disableDepthTestDistance: Number.POSITIVE_INFINITY // draws the label in front of terrain
    }
  })

  return entityBlankPoint
}
