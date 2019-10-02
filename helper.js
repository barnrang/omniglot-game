var monodata = new Array(420 * 420 * 4).fill(0);

function extract_image(){
    let imgdata = ctx_pad.getImageData(0,0,420,420)
    console.log(monodata.length);
    
    for (let i=0, len = imgdata.data.length/4; i < len; i += 1) {
                    monodata[i*4] = imgdata.data[i*4+3];
                }
    let image_data = new ImageData(new Uint8ClampedArray(monodata), 420, 420);
    console.log(monodata.length);
    return tf.browser.fromPixels(image_data, 1).sub(255).abs().resizeNearestNeighbor([105,105]).expandDims()
}

function get_result(tensor1, tensor2){
    let feature1 = feature_model.predict(tensor1)
    let feature2 = feature_model.predict(tensor2)
    let diff = tf.abs(tf.sub(feature1,feature2))
    let result = regress_model.predict(diff)
    return result
}