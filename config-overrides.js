const {
    override,
    fixBabelImports,
    addLessLoader,
    disableEsLint,
    addDecoratorsLegacy
  } = require("customize-cra");
  
  
  module.exports = override(
    disableEsLint(),
    addDecoratorsLegacy(),
    fixBabelImports("import", {
      libraryName: "antd", libraryDirectory: "es", style: true // change importing css to less
    }),
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: { "@primary-color": "#1DA57A" }
    })
  );