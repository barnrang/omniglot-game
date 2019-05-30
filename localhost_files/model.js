class Model {
    constructor() {
        this.model_path = []
        this.extract_feature = await tf.loadLayersModel('models/js_feature_keras_weight/model.json');
        this.regression = await tf.loadLayersModel('models/regress_keras_weight');;
    }

    get_feature(imgs) {
        return this.extract_feature.predict(imgs);
    }
    
    get_regress(diff_features) {
        return this.regression.predict(diff_features);
    }

    get_predict(imgs1, imgs2){
        const feature1 = this.get_feature(imgs1);
        const feature2 = this.get_feature(imgs2);
        const diff_features = tf.abs(feature1 - feature2);
        return this.get_regress(diff_features)
    }

}