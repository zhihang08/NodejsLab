class Shap{
    constructor(width, length, color){
        this.length = length;
        this.width = width;
        this.color = color
    }
    generateMobius(){

    }
    generateLine(){
        //create a blue LineBasicMaterial
        var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3( -10, 0, 0) );
        geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
        geometry.vertices.push(new THREE.Vector3( 10, 0, 0) );
        var line = new THREE.Line( geometry, material );
        return line;
    }
};
var Scenario = function(){
    return{
        setUpCamera: ()=>{
            var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
            camera.position.set( 0, 0, 100 );
            camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
            return camera;
        },
        setUpWindow: ()=>{
            var renderer = new THREE.WebGLRenderer();
            renderer.setSize( window.innerWidth, window.innerHeight );
            document.body.appendChild( renderer.domElement );
            return renderer;
        },
        setUpScene: ()=>{
            var scene = new THREE.Scene();
            return scene;
        }
    }
}();
$(function(){
    var scene = Scenario.setUpScene();
    var camera = Scenario.setUpCamera();
    var renderer = Scenario.setUpWindow();
    var shapInstance = new Shap(0, 0);
    line = shapInstance.generateLine();
    scene.add( line );
    renderer.render( scene, camera );
});