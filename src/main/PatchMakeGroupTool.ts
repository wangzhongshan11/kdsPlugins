import { groupFacesByConnection, isKFace } from "./utils";

// export class PatchMakeGroupTool implements KTool {

//     onToolActive(): void {
//     }

//     onToolDeactive(): void {
//  }
//     onMouseMove(event: KMouseEvent, inferenceResult?: KInferenceResult): void {
        
//     }
//     onLButtonUp(event: KMouseEvent, inferenceResult?: KInferenceResult): void {
       
//     }
//     onRButtonUp(event: KMouseEvent, inferenceResult?: KInferenceResult): void {
//         app.deactivateCustomTool(this);
//     }
//     onLButtonDbClick(event: KMouseEvent, inferenceResult?: KInferenceResult): void {
//         ;
//     }
//     allowUsingInference(): boolean {
//         return true;
//     }
//     onKeyDown(event: KKeyBoardEvent): void {
//         ;
//     }
//     onKeyUp(event: KKeyBoardEvent): void {
//         ;
//     }
// }

// export const patchMakeGroupTool = new PatchMakeGroupTool();
export function patchMakeGroup() {
    const design = app.getActiveDesign();
    const selection = app.getSelection();
    const allEntities = selection.getAllEntities();
    const allFaces: KFace[] = [];
    for (const entity of allEntities) {
        if (isKFace(entity)) {
            allFaces.push(entity);
        }
    }
    const groupFaces: KFace[][] = groupFacesByConnection(allFaces);
    if (groupFaces.length) {
        const newGroupInstances: KGroupInstance[] = [];
        design.startOperation();
        let operationSuccess: boolean = false;
        for (const patch of groupFaces) {
            const newGroupInstance =  design.makeGroup(patch, [], [])?.addedInstance;
            if (newGroupInstance) {
                operationSuccess = true;
                newGroupInstances.push(newGroupInstance);
            } else {
                operationSuccess = false;
                break;
            }
        }
        if (operationSuccess) {
            design.commitOperation();
        } else {
            design.abortOperation();
        }
    }
}