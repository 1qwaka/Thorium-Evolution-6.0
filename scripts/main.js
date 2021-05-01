const ThoriumEvolutionScripts = {
  "blocks/": [
    "radium-fabric",
    "accelerating-projector"
  ],
  "blocks/turrets/": [
    "edge",
    "thorium-breaker",
    "sea-rock",
    "eruption",
    "tedischarge",
    "nox-artillery-t1",
    "missile-launcher",
    "missile-launcher-small",
    "lemegeton"
  ],
  "units/naval/":[
    "soma",
    "troglodyte",
    "talcus",
    "thallasconus",
    "littoralis"
  ],
  "": ["mod-name","units"]
};


for (var folder in ThoriumEvolutionScripts) {
  for (var script in ThoriumEvolutionScripts[folder]) {
    require(folder + ThoriumEvolutionScripts[folder][script]);
  }
}

// Vars.enableConsole = true;