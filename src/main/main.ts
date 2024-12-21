import { alignTool } from "./AlignTool";
import { patchMakeGroup, patchMakeGroupTool } from "./PatchMakeGroupTool";

const pluginUI = app.getPluginUI();
pluginUI.resize(240, 700);
pluginUI.mount();

let activatedCustomTool: KTool | undefined;

async function onUIMessage(data: any) {
    try {
        if (data.type === 'activateAlignTool') {
            app.activateCustomTool(alignTool, true);
            activatedCustomTool = alignTool;
        } else if (data.type === 'deActivateAlignTool') {
            app.deactivateCustomTool(alignTool, false);
            activatedCustomTool = undefined;
        } if (data.type === 'patchMakeGroup') {
            patchMakeGroup();
        } else if (data.type === 'deActivatePatchMakeGroupTool') {
            app.deactivateCustomTool(patchMakeGroupTool, false);
            activatedCustomTool = undefined;
        }
    } catch (error) {
        console.error(error);
        closePlugin();
    }
}

pluginUI.onMessage(onUIMessage);

const selection = app.getSelection();
selection.addObserver({
    onSelectionChange: () => {

    }
});

// function onPluginStartUp() {
// }
// onPluginStartUp();