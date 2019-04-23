import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import self from "../index";

// const materials = require("./materials.json");


/**
 * Material Manager allows you to load and reuse material you use in your scene
 */
class MaterialManager {

    /**
     * @class bematrix.MaterialManager
     * */
    constructor() {
        // default texturePath, will be added as prefix to texture url
        this.texturePath = self.app.config.get("texturePath") || "./";

        this.loadedMaterials = {};
        this.loadedTextures = {};

        if (self.app.modules.obsidianBabylonEngine.isReady) {
            this.scene = self.app.modules.obsidianBabylonEngine.scene;
            this.init();
        } else {
            self.app.events.on("@obsidian-babylon-engine.ready", (engine) => {
                /** @type BABYLON.Scene  */
                this.scene = engine.scene;
                this.init();
            });
        }
    }

    init() {
        this.loadMaterialsFromJSON("assets/materials/materials.json");
        // this.loadMaterial("inox", materials.inox);
        self.app.events.emit("ready");
    }

    loadMaterialsFromJSON(jsonURL) {
        self.app.modules.httpRequest.getJson(jsonURL)
            .then((materialObjects) => {
                // TODO double url resolve
                // https://nodejs.org/api/url.html#url_url_resolve_from_to
                this.loadMaterials(materialObjects);
            })
            .catch((error) => {
                self.app.log.error(error);
            });
    }

    loadMaterials(materialObjects) {
        Object.keys(materialObjects).forEach((name) => {
            this.loadMaterial(name, materialObjects[name]);
        });
    }

    disposeMaterials(materialsNames) {
        Object.keys(materialsNames).forEach((materialsName) => {
            this.disposeMaterial(materialsName);
        });
    }

    /**
     * Creates a material named after the name parameter
     * Parameters in the param Object will be assigned to the material :
     * - type : type of material, e.g. StandardMaterial, PBRMaterial, PBRMetallicRoughnessMaterial
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
        if (!this.loadedMaterials[name]) {
            // type represent material type,
            // it can be PBRMaterial, StandardMaterial, PBRMetallicRoughnessMaterial etc.
            // by default it's StandardMaterial
            let type = params.type || "StandardMaterial";
            if (typeof BABYLON[type] !== "function") {
                type = "StandardMaterial";
            }
            const mat = new BABYLON[type](name, this.scene);
            Object.keys(params).forEach((pK) => {
                if (pK.includes("Texture")) {
                    const texParams = params[pK];
                    if (!texParams.url) {
                        self.app.log.error("No url specified for ", pK, " of material ", name);
                    }
                    mat[pK] = this.loadTexture(texParams.url, texParams);
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

    disposeMaterial(materialName) {
        if (this.loadedMaterials[materialName]) {
            this.loadedMaterials[materialName].dispose();
            delete this.loadedMaterials[materialName];
        }
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
                    this.texturePath + url,
                    this.scene,
                    params.size ? params.size : 256
                );
            } else if (extension === "dds") {
                this.loadedTextures[url] = BABYLON.CubeTexture.CreateFromPrefilteredData(
                    this.texturePath + url,
                    this.scene
                );
            } else {
                // Other textures type
                this.loadedTextures[url] = new BABYLON.Texture(
                    this.texturePath + url,
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

    disposeTexture(url) {
        if (this.loadedTextures[url]) {
            this.loadedTextures[url].dispose();
            delete this.loadedTextures[url];
        }
    }

}

export default MaterialManager;
