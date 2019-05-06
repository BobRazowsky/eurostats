import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import * as URL from "url";
import * as uuidv3 from "uuid/v3";
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
        this.texturePath = self.app.config.get("texturePath") || "./texturePath";
        this.loadedMaterials = {};
        this.loadedTextures = {};

        /**
         * used to generate texture ids from their url and parameters
        */
        this.uuidNamespace = "d362939c-3648-4d31-8f2d-977a6abca424";

        /**
         * Dom element for the material switcher
         * (disabled by default )
         */
        this.switcherDomElement = null;

        if (self.app.modules.obsidianBabylonEngine.isReady) {
            this.scene = self.app.modules.obsidianBabylonEngine.scene;
            MaterialManager.init();
        } else {
            self.app.events.on("@obsidian-babylon-engine.ready", (engine) => {
                /** @type BABYLON.Scene  */
                this.scene = engine.scene;
                MaterialManager.init();
            });
        }

        if (self.app.config.get("debug") === true) {
            this.initDebug();
        }
    }

    static init() {
        self.app.events.emit("ready");
    }

    initDebug() {
        window.materialManager = this;
    }

    /**
     * Return list of loaded materials, alias of this.loadedMaterials
     * @return {Object} listMaterials
     */
    getMaterials() {
        return this.loadedMaterials;
    }

    /**
     * Return list of loaded textures, alias of this.loadedTextures
     * @return {Object} listTextures
     */
    getTextures() {
        return this.loadedTextures;
    }

    /**
     * loadMaterialsFromJSON
     *
     * @param jsonURL
     */
    loadMaterialsFromJSON(jsonURL) {
        return self.app.modules.httpRequest.getJson(jsonURL)
            .then((materialObjects) => {
                this.loadMaterials(materialObjects);
                return true;
            })
            .catch((error) => {
                self.app.log.error(error);
            });
    }

    /**
     * loadMaterials
     *
     * @param materialObjects
     */
    loadMaterials(materialObjects) {
        Object.keys(materialObjects).forEach((name) => {
            this.loadMaterial(name, materialObjects[name]);
        });
    }

    loadMaterialsSample() {
        this.loadMaterials(require("./materials-sample"));
    }

    /**
     * disposeMaterials
     *
     * @param materialsNames
     */
    disposeMaterials(materialsNames) {
        Object.keys(materialsNames).forEach((materialsName) => {
            this.disposeMaterial(materialsName);
        });
    }

    /**
     * Creates a material named after the name parameter
     * Parameters in the param Object will be assigned to the material :
     * - type : type of material, e.g. StandardMaterial, PBRMaterial, PBRMetallicRoughnessMaterial
     * - Primitives (string, number, boolean, object) will be applied directly
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

            let type = "StandardMaterial";
            if (params.type) {
                if (typeof BABYLON[params.type] === "function") {
                    ({
                        type,
                    } = params); // go to hell eslint
                }
                delete params.type;
            }
            const mat = new BABYLON[type](name, this.scene);
            Object.keys(params).forEach((pK) => {
                if (pK.includes("Texture")) {
                    const texParams = params[pK];
                    if (!texParams.url) {
                        self.app.log.error("No url specified for ", pK, " of material ", name);
                    }
                    const texUrl = texParams.url;
                    delete texParams.url;
                    mat[pK] = this.loadTexture(texUrl, texParams);
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
                self.app.events.emit("load-material", name);
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
        const id = this.generateTextureId(url, params);
        if (!this.loadedTextures[id]) {
            // dds & hdr handling for env map
            const urlSplit = url.split(".");
            const extension = urlSplit[urlSplit.length - 1].toLowerCase();
            const completeUrl = URL.resolve(this.texturePath, url);
            if (extension === "hdr") {
                this.loadedTextures[id] = new BABYLON.HDRCubeTexture(
                    completeUrl,
                    this.scene,
                    params.size ? params.size : 256
                );
            } else if (extension === "dds") {
                this.loadedTextures[id] = BABYLON.CubeTexture.CreateFromPrefilteredData(
                    completeUrl,
                    this.scene
                );
            } else {
                // Other textures type
                this.loadedTextures[id] = new BABYLON.Texture(
                    completeUrl,
                    this.scene
                );
            }
        }
        const tex = this.loadedTextures[id].clone();
        Object.keys(params).forEach((param) => {
            tex[param] = params[param];
        });
        return tex;
    }

    /**
     * Generate an unique id for this texture url with those parameters
     * @param url
     * @param params
     * @returns {String}
     */
    generateTextureId(url, params) {
        const sortedParams = {};
        Object.keys(params).sort().forEach((k) => {
            sortedParams[k] = params[k];
        });
        return uuidv3(url + JSON.stringify(params), this.uuidNamespace);
    }

    disposeTexture(id) {
        if (this.loadedTextures[id]) {
            this.loadedTextures[id].dispose();
            delete this.loadedTextures[id];
        }
    }

    /**
     * show an UI to change the material of the mesh in parameter
     * display all the material availables in the library
     * @param {BABYLON.Mesh|string} mesh - the mesh to apply the material to, or its id
     */
    showSwitcher(mesh) {
        if (this.switcherDomElement) {
            this.switcherDomElement.innerHTML = "";
        } else {
            this.switcherDomElement = document.createElement("div");
        }
        let meshSwitch = null;
        if (typeof (mesh) === "string") {
            meshSwitch = this.scene.meshes.find(m => m.id === mesh);
        } else {
            meshSwitch = mesh;
        }
        if (!meshSwitch) {
            throw new Error("Mesh for material switcher not found");
        }
        const materialList = document.createElement("ul");
        const refreshMaterialList = () => {
            materialList.innerHTML = "";
            Object.keys(this.loadedMaterials).forEach((matName) => {
                const matDom = document.createElement("li");
                matDom.innerHTML = matName;
                matDom.style.cursor = "pointer";
                matDom.onmouseover = () => {
                    matDom.style.color = "#FF00A4";
                };
                matDom.onmouseout = () => {
                    matDom.style.color = "black";
                };
                matDom.onclick = () => {
                    meshSwitch.material = this.loadedMaterials[matName];
                    self.app.modules.obsidianBabylonEngine.loop();
                };
                materialList.appendChild(matDom);
            });
        };
        refreshMaterialList();
        self.app.events.on("load-material", () => refreshMaterialList());
        this.switcherDomElement.id = "obsidian-switch-container";
        this.switcherDomElement.style.width = "200px";
        this.switcherDomElement.style.position = "fixed";
        this.switcherDomElement.style.right = "0px";
        this.switcherDomElement.style.backgroundColor = "#ffffff";
        this.switcherDomElement.style.opacity = 0.8;
        const toggleMin = document.createElement("button");
        const toggleMax = document.createElement("button");
        toggleMax.style.display = "none";
        toggleMin.innerHTML = ">>";
        toggleMin.onclick = () => {
            this.switcherDomElement.style.width = "15px";
            toggleMin.style.display = "none";
            toggleMax.style.display = "block";
        };
        toggleMax.innerHTML = "<<";
        toggleMax.onclick = () => {
            this.switcherDomElement.style.width = "200px";
            toggleMax.style.display = "none";
            toggleMin.style.display = "block";
        };
        this.switcherDomElement.appendChild(toggleMin);
        this.switcherDomElement.appendChild(toggleMax);
        const title = document.createElement("p");
        title.innerHTML = "<b>Obsidian Material manager</b>";
        this.switcherDomElement.appendChild(title);
        this.switcherDomElement.appendChild(materialList);
        document.body.appendChild(this.switcherDomElement);
    }

    hideSwitcher() {
        if (this.switcherDomElement) {
            document.body.removeChild(this.switcherDomElement);
            delete this.switcherDomElement;
        }
    }


}

export default MaterialManager;
