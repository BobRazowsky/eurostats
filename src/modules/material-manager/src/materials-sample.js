const MaterialsSample = {
    debug: {
        // metadata is an optionnal attributes that help you give extra informations to user
        // tags can be used to found faster your material it also can be use
        // to improve description of your material for future use (e.g. HD renderer)
        metadata: {
            tags: ["debug", "test"],
            comments: ["You can use this material to debug"],
        },
        diffuseColor: {
            r: 1,
            g: 0,
            b: 0,
        },
    },
    plastic: {
        metadata: {
            tags: ["plastic", "PBRMaterial"],
        },
        type: "PBRMaterial",
        albedoColor: "#555555",
        reflectivityColor: "#555555",
        microSurface: 0.5,
    },
};
module.exports = MaterialsSample;
