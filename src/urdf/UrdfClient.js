/**
 * @author Jihoon Lee - jihoonlee.in@gmail.com
 * @author Russell Toris - rctoris@wpi.edu
 */

/**
 * A URDF client can be used to load a URDF and its associated models into a 3D object from the ROS
 * parameter server.
 *
 * Emits the following events:
 *
 * * 'change' - emited after the URDF and its meshes have been loaded into the root object
 *
 * @constructor
 * @param options - object with following keys:
 *
 *   * ros - the ROSLIB.Ros connection handle
 *   * param (optional) - the paramter to load the URDF from, like 'robot_description'
 *   * tfClient - the TF client handle to use
 *   * path (optional) - the base path to the associated Collada models that will be loaded
 *   * rootObject (optional) - the root object to add this marker to
 *   * tfPrefix (optional) - the TF prefix to used for multi-robots
 *   * loader (optional) - the Collada loader to use (e.g., an instance of ROS3D.COLLADA_LOADER
 *                         ROS3D.COLLADA_LOADER_2) -- defaults to ROS3D.COLLADA_LOADER_2
 *
 *   * meshPaths (optional) - the base paths to the associated Collada models that will be loaded.
 *                            Base path for each STL is determined by the first directory in the path of the model.
 *                            It applies only on meshes which URI starts with 'package://'
 *                            Example:
 *                              meshPaths = { "robot" : "media/robots/kuka/", "gripper": "media/grippers" }
 *                              mesh "package://robot/mesh/link1.STL" in URDF will be loaded from "media/robots/kuka/link1.STL"
 *                              mesh "package://gripper/finger.STL" in URDF will be loaded from "media/grippers/finger.STL"
 */
ROS3D.UrdfClient = function(options) {
  var that = this;
  options = options || {};
  var ros = options.ros;
  this.param = options.param || 'robot_description';
  this.path = options.path || '/';
  this.tfClient = options.tfClient;
  this.rootObject = options.rootObject || new THREE.Object3D();
  this.tfPrefix = options.tfPrefix || '';
  this.loader = options.loader || ROS3D.COLLADA_LOADER_2;
  this.meshPaths = options.meshPaths;

  // get the URDF value from ROS
  var getParam = new ROSLIB.Param({
    ros : ros,
    name : this.param
  });
  getParam.get(function(string) {
    // hand off the XML string to the URDF model
    var urdfModel = new ROSLIB.UrdfModel({
      string : string
    });

    // load all models
    that.urdf = new ROS3D.Urdf({
      urdfModel : urdfModel,
      path : that.path,
      tfClient : that.tfClient,
      tfPrefix : that.tfPrefix,
      loader : that.loader,
      meshPaths: that.meshPaths
    });
    that.rootObject.add(that.urdf);
  });
};
