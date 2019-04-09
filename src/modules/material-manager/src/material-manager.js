import * as BABYLON from "babylonjs";
import self from ".";


export default class MaterialManager {

    /**
     * @class bematrix.MaterialManager
     * */
    constructor() {

        this.path = "/assets/textures/";

        this.loadedMaterials = [];

        this.loadedTextures = [];
        self.app.events.on("@obsidian-engine.engine-ready", (scene) => {
            /** @type BABYLON.Scene  */
            this.scene = scene;
        });
    }

    loadMaterials(materialsParams) {
        Object.keys(materialsParams).forEach((name) => {
            this.loadMaterial(name, materialsParams[name]);
        });
    }

    /**
     * Creates a material named after the name parameter
     * Parameters in the param Object will be assigned to the material :
     * - Primitives (string, number, boolean) will be applied directly
     * - Textures must be objects, with an url parameter and classic Babylon Texture parameters
     *   example : { url : "leather.jpg", uScale : 3, vSCale :3 }
     * - Colors can be an hex string (ex : "#FFFFFF")
     *   Or an rgb object, like { r:1, g:1, b:1} for white
     * /!\ If a material with the same name as already been loaded, returns it instead
     *   @param {String} name
     *   @param {Object} params
     *   @returns {BABYLON.StandardMaterial}
     */
    loadMaterial(name, params = {}) {
        // TODO remplacer cette fonction par un loadmaterialJson et utiliser le loadMaterial de aymeric (voir en bas)
        // Le but étant de garder le système de librairie de matériaux et de pouvoir retaper dedans si il a déjà été loadé
        if (!this.loadedMaterials[name]) {
            // Only standard material for performance issues
            const mat = new BABYLON.StandardMaterial(name, this.scene);
            Object.keys(params).forEach((pK) => {
                if (pK.includes("Texture")) {
                    const texParams = params[pK];
                    if (!texParams.url) {
                        /* console.error(
                            "No url specified for ",
                            pK,
                            " of material ",
                            name
                        ); */
                    }
                    const url = texParams.url;
                    delete texParams.url;
                    mat[pK] = this.loadTexture(url, texParams);
                } else if (pK.includes("Color")) {
                    const colorParams = params[pK];
                    let color;
                    if (typeof colorParams === "string") {
                        color = BABYLON.Color3.FromHexString(colorParams);
                    } else {
                        color = new BABYLON.Color3(
                            colorParams.r,
                            colorParams.g,
                            colorParams.b
                        );
                    }
                    mat[pK] = color;
                } else {
                    mat[pK] = params[pK];
                }
                this.loadedMaterials[name] = mat;
            });
        }
        return this.loadedMaterials[name];
    }

    /**
     * Loads a texture from a file located at the url parameter
     * Assign the parameters of the param object to it
     * If the file has already been loaded, clones the texture instead of loading a new one
     * @param {String} url
     * @param {Object} params
     * */
    loadTexture(url, params = {}) {
        if (!this.loadedTextures[url]) {
            // dds & hdr handling for env map
            const urlSplit = url.split(".");
            const extension = urlSplit[urlSplit.length - 1].toLowerCase();
            if (extension === "hdr") {
                this.loadedTextures[url] = new BABYLON.HDRCubeTexture(
                    this.path + url,
                    this.scene,
                    params.size ? params.size : 256
                );
            } else if (extension === "dds") {
                this.loadedTextures[
                    url
                ] = BABYLON.CubeTexture.CreateFromPrefilteredData(
                    this.path + url,
                    this.scene
                );
            } else {
                // Other textures type
                this.loadedTextures[url] = new BABYLON.Texture(
                    this.path + url,
                    this.scene
                );
            }
        }
        const tex = this.loadedTextures[url].clone();
        Object.keys(params).forEach((param) => {
            tex[param] = params[param];
        });
        return tex;
    }

    createHoleMaterial(mat) {
        if (!this.loadedMaterials[`${mat.name}-hole`]) {
            const texMaterial = this.loadTexture("holes.png", {
                uScale: 1,
                vScale: 1,
                uOffset: 0
            });
            /**
             * @type BABYLON.StandardMaterial
             */
            const holeMaterial = mat.clone();
            holeMaterial.ambientTexture = texMaterial;
            this.loadedMaterials[`${mat.name}-hole`] = holeMaterial;
        }
        return this.loadedMaterials[`${mat.name}-hole`];
    }

    /**
     * Create and return the ledskin material
     */
    getLedskinMaterial() {
        if (!this.ledskinMaterial) {
            const texMaterial = this.loadTexture("carbon.png", {
                uScale: 5,
                vScale: 5,
                uOffset: 0
            });
            this.ledskinMaterial = new BABYLON.StandardMaterial("ledskin-mat", this.scene);
            this.ledskinMaterial.ambientTexture = texMaterial;
        }
        return this.ledskinMaterial;
    }


    getMaterial(materialName) {
        let hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("assets/textures/environment.dds", obsidian.engine3d.scene);

        let mat = null;
        switch (materialName) {
            case 'inox':
                mat = new BABYLON.PBRMaterial("inox", obsidian.engine3d.scene);
                mat.reflectivityColor = new BABYLON.Color3(0.85, 0.85, 0.85);
                mat.reflectionTexture = hdrTexture;
                mat.albedoColor = new BABYLON.Color3(0.01, 0.01, 0.01);
                mat.microSurface = 0.85;
                break;
            case 'tolle_gris':
                mat = new BABYLON.PBRMaterial("tolle_gris", obsidian.engine3d.scene);
                mat.albedoColor = new BABYLON.Color3.FromHexString("#bdbcb8");
                mat.reflectivityColor = new BABYLON.Color3.FromHexString("#bdbcb8");
                mat.reflectionTexture = hdrTexture;
                mat.microSurface = 0.7;
                break;
            case 'tolle_bleu':
                mat = new BABYLON.PBRMaterial("tolle_bleue", obsidian.engine3d.scene);
                mat.albedoColor = new BABYLON.Color3.FromHexString("#163257");
                mat.reflectivityColor = new BABYLON.Color3.FromHexString("#163257");
                mat.reflectionTexture = hdrTexture;
                mat.microSurface = 0.7;
                mat.environmentIntensity = 0.1;
                mat.usePhysicalLightFalloff = false;
                break;
            case 'melamine_gris':
                mat = new BABYLON.PBRMaterial("melamine", obsidian.engine3d.scene);
                mat.albedoColor = new BABYLON.Color3.FromHexString("#bdbcb8");
                //mat.albedoTexture = new BABYLON.Texture("assets/images/normal.jpg", obsidian.engine3d.scene);
                mat.ambientColor = new BABYLON.Color3.FromHexString("#bdbcb8");
                mat.reflectivityColor = new BABYLON.Color3.FromHexString("#bdbcb8");
                mat.microSurface = 0.5;
                mat.usePhysicalLightFalloff = false;
                // TODO utiliser le load texture
                mat.bumpTexture = new BABYLON.Texture("assets/textures/wallNormal.jpg", obsidian.engine3d.scene);
                mat.bumpTexture.uScale = 40;
                mat.bumpTexture.vScale = 40;
                mat.bumpTexture.level = 1;
                break;
            case 'material':
                mat = new BABYLON.StandardMaterial("error", obsidian.engine3d.scene);
                mat.diffuseColor = new BABYLON.Color3(0, 1, 0);
                break;
            case 'plastic':
                mat = new BABYLON.PBRMaterial("plastic", obsidian.engine3d.scene);
                mat.albedoColor = new BABYLON.Color3.FromHexString("#555555");
                mat.reflectivityColor = new BABYLON.Color3.FromHexString("#555555");
                mat.microSurface = 0.5;
                break;
            default:
                break;
        }

        return mat;
    }

}
