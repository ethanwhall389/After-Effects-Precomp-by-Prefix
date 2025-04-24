(function thisScript(thisObj) {
  var myScriptPal = buildUi(thisObj);

  if (myScriptPal instanceof Window) {
    myScriptPal.center();
    myScriptPal.show();
  }
})(this);

function buildUi(thisObj) {
  var myPanel =
    thisObj instanceof Panel
      ? thisObj
      : new Window("palette", "Slash-Nested Precompose", undefined, {
          resizable: true,
        });

  var btnGroup = myPanel.add("group");
  btnGroup.orientation = "column";

  // Add a text input for the custom separator
  var separatorGroup = btnGroup.add("group");
  separatorGroup.add("statictext", undefined, "Separate comps by: ");
  var separatorInput = separatorGroup.add("edittext", undefined, "/");
  separatorInput.characters = 5;

  var runBtn = btnGroup.add("button", undefined, "Create Nested Comps");

  runBtn.onClick = function () {
    var separator = separatorInput.text || "/";
    createNestedCompsByPath(separator);
  };

  myPanel.layout.layout(true);
  return myPanel;
}

function createNestedCompsByPath(separator) {
  app.beginUndoGroup("Nested Precompose by Path");

  var rootComp = app.project.activeItem;
  if (!(rootComp && rootComp instanceof CompItem)) {
    alert("Please select a composition");
    return;
  }

  var allLayers = [];
  for (var i = 1; i <= rootComp.numLayers; i++) {
    var layer = rootComp.layer(i);
    var pathParts = layer.name.split(separator);
    if (pathParts.length < 2) continue;

    allLayers.push({
      fullPath: pathParts.slice(0, -1).join(separator),
      layerName: pathParts[pathParts.length - 1],
      originalLayer: layer,
    });
  }

  // Sort paths deepest first
  allLayers.sort(function (a, b) {
    return (
      b.fullPath.split(separator).length - a.fullPath.split(separator).length
    );
  });

  var compMap = {};
  compMap[""] = rootComp;

  for (var i = 0; i < allLayers.length; i++) {
    var entry = allLayers[i];
    var path = entry.fullPath;
    var parts = path.split(separator);

    // Traverse and create parent comps if they don't exist
    var currentPath = "";
    for (var j = 0; j < parts.length; j++) {
      currentPath = (currentPath ? currentPath + separator : "") + parts[j];
      if (!compMap[currentPath]) {
        var parentPath = parts.slice(0, j).join(separator);
        var parentComp = compMap[parentPath];
        var newComp = app.project.items.addComp(
          parts[j],
          parentComp.width,
          parentComp.height,
          parentComp.pixelAspect,
          parentComp.duration,
          parentComp.frameRate
        );
        var newLayer = parentComp.layers.add(newComp);
        newLayer.name = parts[j];
        compMap[currentPath] = newComp;
      }
    }

    // Move this layer into its comp
    var targetComp = compMap[path];
    var layer = entry.originalLayer;

    // Add the layer's source to the target composition
    var newLayer = targetComp.layers.add(layer.source);

    // Match the layer's properties (e.g., in/out points, transformations)
    newLayer.startTime = layer.startTime;
    newLayer.inPoint = layer.inPoint;
    newLayer.outPoint = layer.outPoint;
    newLayer.transform.position.setValue(layer.transform.position.value);
    newLayer.transform.scale.setValue(layer.transform.scale.value);
    newLayer.transform.rotation.setValue(layer.transform.rotation.value);
    newLayer.transform.opacity.setValue(layer.transform.opacity.value);

    // Rename the new layer to keep only the last portion of the name
    var nameParts = layer.name.split(separator);
    newLayer.name = nameParts[nameParts.length - 1];

    // Remove the original layer from the root composition
    layer.remove();
  }

  app.endUndoGroup();
}
