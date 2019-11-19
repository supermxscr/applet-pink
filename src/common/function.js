export function setImageHeight( data ) {
  let windowWidth
  uni.getSystemInfo( {
    success: function ( res ) {
      windowWidth = res.windowWidth
      uni.getImageInfo( {
        src: data,
        success: function ( image ) {
          return windowWidth * image.height / image.width
        }
      } )
    }
  } )
}