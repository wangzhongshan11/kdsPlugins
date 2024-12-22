/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main/AlignTool.ts":
/*!*******************************!*\
  !*** ./src/main/AlignTool.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AlignTool: () => (/* binding */ AlignTool),
/* harmony export */   alignTool: () => (/* binding */ alignTool)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/main/utils.ts");

var Stage;
(function (Stage) {
    Stage[Stage["PickUpModel"] = 0] = "PickUpModel";
    Stage[Stage["PickUpTarget"] = 1] = "PickUpTarget";
})(Stage || (Stage = {}));
class AlignTool {
    constructor() {
        this.stage = Stage.PickUpModel;
    }
    onToolActive() {
    }
    onToolDeactive() {
        const pluginUI = app.getPluginUI();
        this.tryCommit();
        pluginUI.postMessage({ type: 'leaveAlignTool' }, '*');
        this.clear();
    }
    onMouseMove(event, inferenceResult) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const entity = inferenceResult === null || inferenceResult === void 0 ? void 0 : inferenceResult.entity;
        const appView = app.getActiveView();
        const curModel = this.stage === Stage.PickUpModel ? this.model : this.targetModel;
        if (entity) {
            const transform = inferenceResult.instancePath.reduce((acc, instance) => {
                acc.multiply(instance.getTransform());
                return acc;
            }, GeomLib.createIdentityMatrix4());
            let inferenceModel;
            if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKFace)(entity)) {
                const surface = entity.getSurface();
                if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKPlane)(surface)) {
                    if (!(0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKFace)(curModel === null || curModel === void 0 ? void 0 : curModel.inferenceEntity) || (curModel === null || curModel === void 0 ? void 0 : curModel.inferenceEntity.getKey()) !== entity.getKey()) {
                        const normal = inferenceResult.normal;
                        // const normal = surface.normal.appliedMatrix4(transform);
                        const faceVertexPoints = [];
                        entity.getVertices().forEach(vertex => {
                            const point = vertex.getPoint();
                            if (point) {
                                faceVertexPoints.push(point.appliedMatrix4(transform));
                            }
                        });
                        inferenceModel = { position: inferenceResult.position, inferenceEntity: entity, normal, path: inferenceResult.instancePath };
                        if (curModel === null || curModel === void 0 ? void 0 : curModel.tempShapeId) {
                            appView.clearTemporaryShapesByIds([curModel.tempShapeId]);
                        }
                        if (faceVertexPoints.length > 1) {
                            faceVertexPoints.push(faceVertexPoints[0]);
                            const tempShapeId = (_a = appView.drawFlatLines([faceVertexPoints], {
                                color: { r: 255, g: 0, b: 0 },
                                pattern: KLinePattern.Solid,
                            })) === null || _a === void 0 ? void 0 : _a.ids[0];
                            inferenceModel.tempShapeId = tempShapeId;
                        }
                        if (this.stage === Stage.PickUpModel) {
                            this.model = inferenceModel;
                        }
                        else {
                            this.targetModel = inferenceModel;
                        }
                        return;
                    }
                    curModel.position = inferenceResult.position;
                    return;
                }
            }
            else if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKEdge)(entity)) {
                const p0 = (_b = entity.getVertexA()) === null || _b === void 0 ? void 0 : _b.getPoint();
                const p1 = (_c = entity.getVertexB()) === null || _c === void 0 ? void 0 : _c.getPoint();
                if (p0 && p1) {
                    if (!(0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKEdge)(curModel === null || curModel === void 0 ? void 0 : curModel.inferenceEntity) || (curModel === null || curModel === void 0 ? void 0 : curModel.inferenceEntity.getKey()) !== entity.getKey()) {
                        const points = [p0.appliedMatrix4(transform), p1.appliedMatrix4(transform)];
                        const direction = points[1].subtracted(points[0]);
                        inferenceModel = { position: inferenceResult.position, inferenceEntity: entity, direction, path: inferenceResult.instancePath, };
                        if (curModel === null || curModel === void 0 ? void 0 : curModel.tempShapeId) {
                            appView.clearTemporaryShapesByIds([curModel.tempShapeId]);
                        }
                        const tempShapeId = (_d = appView.drawFlatLines([points], {
                            color: { r: 255, g: 0, b: 0 },
                            pattern: KLinePattern.Solid,
                        })) === null || _d === void 0 ? void 0 : _d.ids[0];
                        inferenceModel.tempShapeId = tempShapeId;
                        if (this.stage === Stage.PickUpModel) {
                            this.model = inferenceModel;
                        }
                        else {
                            this.targetModel = inferenceModel;
                        }
                        return;
                    }
                    curModel.position = inferenceResult.position;
                    return;
                }
            }
            else if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKVertex)(entity)) {
                const p0 = entity.getPoint();
                if (p0) {
                    if (!(0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKVertex)(curModel === null || curModel === void 0 ? void 0 : curModel.inferenceEntity) || !((_e = curModel === null || curModel === void 0 ? void 0 : curModel.inferenceEntity.getPoint()) === null || _e === void 0 ? void 0 : _e.isEqual(p0))) {
                        inferenceModel = { position: inferenceResult.position, inferenceEntity: entity, path: inferenceResult.instancePath, };
                        if (curModel === null || curModel === void 0 ? void 0 : curModel.tempShapeId) {
                            appView.clearTemporaryShapesByIds([curModel.tempShapeId]);
                        }
                        const tempShapeId = (_f = appView.drawPoints([p0.appliedMatrix4(transform)], {
                            color: { r: 255, g: 0, b: 0 },
                        })) === null || _f === void 0 ? void 0 : _f.id;
                        inferenceModel.tempShapeId = tempShapeId;
                        if (this.stage === Stage.PickUpModel) {
                            this.model = inferenceModel;
                        }
                        else {
                            this.targetModel = inferenceModel;
                        }
                        return;
                    }
                    curModel.position = inferenceResult.position;
                    return;
                }
            }
            else if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKAuxiliaryBoundedCurve)(entity)) {
                const boundedCurve = entity.getBoundedCurve();
                if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKArc3d)(boundedCurve)) {
                    const curvePoints = boundedCurve.getApproximatePointsByAngle();
                    if (curvePoints.length) {
                        if (!(0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKAuxiliaryBoundedCurve)(curModel === null || curModel === void 0 ? void 0 : curModel.inferenceEntity) || (curModel === null || curModel === void 0 ? void 0 : curModel.inferenceEntity.getKey()) !== entity.getKey()) {
                            const points = curvePoints.map(p => p.appliedMatrix4(transform));
                            const normal = boundedCurve.normal.appliedMatrix4(transform).normalized();
                            inferenceModel = { position: inferenceResult.position, inferenceEntity: entity, normal, path: inferenceResult.instancePath, };
                            if (curModel === null || curModel === void 0 ? void 0 : curModel.tempShapeId) {
                                appView.clearTemporaryShapesByIds([curModel.tempShapeId]);
                            }
                            const tempShapeId = (_g = appView.drawFlatLines([points], {
                                color: { r: 255, g: 0, b: 0 },
                                pattern: KLinePattern.Solid,
                            })) === null || _g === void 0 ? void 0 : _g.ids[0];
                            inferenceModel.tempShapeId = tempShapeId;
                            if (this.stage === Stage.PickUpModel) {
                                this.model = inferenceModel;
                            }
                            else {
                                this.targetModel = inferenceModel;
                            }
                            return;
                        }
                        curModel.position = inferenceResult.position;
                        return;
                    }
                }
                else {
                    const p0 = (_h = entity.getStartVertex()) === null || _h === void 0 ? void 0 : _h.getPoint();
                    const p1 = (_j = entity.getEndVertex()) === null || _j === void 0 ? void 0 : _j.getPoint();
                    if (p0 && p1) {
                        if (!(0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKAuxiliaryBoundedCurve)(curModel === null || curModel === void 0 ? void 0 : curModel.inferenceEntity) || (curModel === null || curModel === void 0 ? void 0 : curModel.inferenceEntity.getKey()) !== entity.getKey()) {
                            const points = [p0.appliedMatrix4(transform), p1.appliedMatrix4(transform)];
                            const direction = points[1].subtracted(points[0]);
                            inferenceModel = { position: inferenceResult.position, inferenceEntity: entity, direction, path: inferenceResult.instancePath, };
                            if (curModel === null || curModel === void 0 ? void 0 : curModel.tempShapeId) {
                                appView.clearTemporaryShapesByIds([curModel.tempShapeId]);
                            }
                            const tempShapeId = (_k = appView.drawFlatLines([points], {
                                color: { r: 255, g: 0, b: 0 },
                                pattern: KLinePattern.Solid,
                            })) === null || _k === void 0 ? void 0 : _k.ids[0];
                            inferenceModel.tempShapeId = tempShapeId;
                            if (this.stage === Stage.PickUpModel) {
                                this.model = inferenceModel;
                            }
                            else {
                                this.targetModel = inferenceModel;
                            }
                            return;
                        }
                        curModel.position = inferenceResult.position;
                        return;
                    }
                }
            }
            else if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKAuxiliaryLine)(entity)) {
                const line = entity.getLine();
                if (!(0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKAuxiliaryLine)(curModel === null || curModel === void 0 ? void 0 : curModel.inferenceEntity) || (curModel === null || curModel === void 0 ? void 0 : curModel.inferenceEntity.getKey()) !== entity.getKey()) {
                    const { direction: lineDirection, origin } = line;
                    const points = [origin.added(lineDirection.multiplied(100000)).appliedMatrix4(transform), origin.added(lineDirection.multiplied(-100000)).appliedMatrix4(transform)];
                    const direction = points[1].subtracted(points[0]);
                    inferenceModel = { position: inferenceResult.position, inferenceEntity: entity, direction, path: inferenceResult.instancePath, };
                    if (curModel === null || curModel === void 0 ? void 0 : curModel.tempShapeId) {
                        appView.clearTemporaryShapesByIds([curModel.tempShapeId]);
                    }
                    const tempShapeId = (_l = appView.drawFlatLines([points], {
                        color: { r: 255, g: 0, b: 0 },
                        pattern: KLinePattern.Solid,
                    })) === null || _l === void 0 ? void 0 : _l.ids[0];
                    inferenceModel.tempShapeId = tempShapeId;
                    if (this.stage === Stage.PickUpModel) {
                        this.model = inferenceModel;
                    }
                    else {
                        this.targetModel = inferenceModel;
                    }
                    return;
                }
                curModel.position = inferenceResult.position;
                return;
            }
            else if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKArchFace)(entity)) {
                if (this.stage === Stage.PickUpTarget) {
                    const surface = entity.getSurface();
                    if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKPlane)(surface)) {
                        const contour = entity.getFace3d().contour;
                        const normal = inferenceResult.normal;
                        // const normal = surface.normal.appliedMatrix4(transform);
                        const contourPoints = contour.map(segment => segment.startPoint);
                        inferenceModel = { position: inferenceResult.position, inferenceEntity: entity, normal, path: inferenceResult.instancePath };
                        if (curModel === null || curModel === void 0 ? void 0 : curModel.tempShapeId) {
                            appView.clearTemporaryShapesByIds([curModel.tempShapeId]);
                        }
                        if (contourPoints.length > 1) {
                            contourPoints.push(contourPoints[0]);
                            const tempShapeId = (_m = appView.drawFlatLines([contourPoints], {
                                color: { r: 255, g: 0, b: 0 },
                                pattern: KLinePattern.Solid,
                            })) === null || _m === void 0 ? void 0 : _m.ids[0];
                            inferenceModel.tempShapeId = tempShapeId;
                        }
                        this.targetModel = inferenceModel;
                        return;
                    }
                }
            }
            else if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKGroupInstance)(entity)) {
            }
        }
        if (curModel === null || curModel === void 0 ? void 0 : curModel.tempShapeId) {
            appView.clearTemporaryShapesByIds([curModel.tempShapeId]);
        }
        if (this.stage === Stage.PickUpModel) {
            this.model = undefined;
        }
        else {
            this.targetModel = undefined;
        }
    }
    onLButtonUp(event, inferenceResult) {
        if (this.stage === Stage.PickUpModel) {
            if (this.model) {
                this.stage = Stage.PickUpTarget;
            }
        }
        else {
            if (this.targetModel) {
                app.deactivateCustomTool(this);
            }
        }
    }
    tryCommit() {
        if (this.model && this.targetModel) {
            const design = app.getActiveDesign();
            const editPath = design.getEditPath();
            const editTransform = editPath.reduce((acc, instance) => {
                acc.multiply(instance.getTransform());
                return acc;
            }, GeomLib.createIdentityMatrix4());
            const { position: modelPosition, inferenceEntity: modelEntity, normal: modelNormal, direction: modelDirection, path: modelPath } = this.model;
            const { position: targetPosition, normal: targetNormal, direction: targetDirection } = this.targetModel;
            const mat = editTransform.inversed().multiplied(GeomLib.createTranslationMatrix4(targetPosition.x - modelPosition.x, targetPosition.y - modelPosition.y, targetPosition.z - modelPosition.z));
            const targetNormalReverse = targetNormal === null || targetNormal === void 0 ? void 0 : targetNormal.reversed();
            if (targetNormalReverse) {
                if (modelNormal && !modelNormal.isParallel(targetNormalReverse)) {
                    const crossVec = modelNormal.cross(targetNormalReverse).normalized();
                    const angel = modelNormal.angleTo(targetNormalReverse, crossVec);
                    const rotateMatrix = GeomLib.createRotateMatrix4(angel, crossVec, this.model.position);
                    mat.multiply(rotateMatrix);
                }
                else if (modelDirection && !modelDirection.isPerpendicular(targetNormalReverse)) {
                    const crossVec1 = modelDirection.cross(targetNormalReverse).normalized();
                    const angel1 = modelDirection.angleTo(targetNormalReverse, crossVec1);
                    const rotateMatrix1 = GeomLib.createRotateMatrix4(angel1 - Math.PI / 2 * (angel1 > Math.PI ? 3 : 1), crossVec1, this.model.position);
                    mat.multiply(rotateMatrix1);
                }
            }
            else if (targetDirection) {
                if (modelNormal && !modelNormal.isPerpendicular(targetDirection)) {
                    const crossVec2 = modelNormal.cross(targetDirection).normalized();
                    const angel2 = modelNormal.angleTo(targetDirection, crossVec2);
                    const rotateMatrix1 = GeomLib.createRotateMatrix4(angel2 - Math.PI / 2 * (angel2 > Math.PI ? 3 : 1), crossVec2, this.model.position);
                    mat.multiply(rotateMatrix1);
                }
                else if (modelDirection && !modelDirection.isParallel(targetDirection)) {
                    const crossVec3 = modelDirection.cross(targetDirection).normalized();
                    const angel3 = modelDirection.angleTo(targetDirection, crossVec3);
                    const rotateMatrix1 = GeomLib.createRotateMatrix4(angel3 - Math.PI / 2 * (angel3 > Math.PI ? 3 : 1), crossVec3, this.model.position);
                    mat.multiply(rotateMatrix1);
                }
            }
            mat.multiply(editTransform);
            const targetToTransform = modelPath.find(instance => !editPath.some(ins => ins.getKey() === instance.getKey())) || modelEntity;
            let transformSuccess = false;
            if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKFace)(targetToTransform) || (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKEdge)(targetToTransform)) {
                const shell = targetToTransform.getShell();
                if (shell) {
                    transformSuccess = design.transformShells([shell], mat).isSuccess;
                }
            }
            else if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKVertex)(targetToTransform)) {
                const shell = targetToTransform.getEdges()[0].getShell();
                if (shell) {
                    transformSuccess = design.transformShells([shell], mat).isSuccess;
                }
            }
            else if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKAuxiliaryBoundedCurve)(targetToTransform) || (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKAuxiliaryLine)(targetToTransform)) {
                transformSuccess = design.transformAuxiliaryCurves([targetToTransform], mat).isSuccess;
            }
            else if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKGroupInstance)(targetToTransform)) {
                transformSuccess = design.transformGroupInstances([targetToTransform], mat).isSuccess;
            }
            if (transformSuccess) {
                const selection = app.getSelection();
                selection.add([targetToTransform]);
            }
            // const pickHelper = app.getPickHelper();
            // // const pickableEntityType = this.model ? [KEntityType.AuxiliaryBoundedCurve] : [KAppEntityType.GroupInstance, KEntityType.Face];
            // const allPickedEntities = pickHelper.pickByPoint(event.clientX(), event.clientY()).getAllPicked();
        }
    }
    clear() {
        const appView = app.getActiveView();
        appView.clearTemporaryShapes();
        this.model = undefined;
        this.targetModel = undefined;
        this.stage = Stage.PickUpModel;
    }
    onRButtonUp(event, inferenceResult) {
        app.deactivateCustomTool(this);
    }
    onLButtonDbClick(event, inferenceResult) {
        ;
    }
    allowUsingInference() {
        return true;
    }
    onKeyDown(event) {
        ;
    }
    onKeyUp(event) {
        ;
    }
}
const alignTool = new AlignTool();


/***/ }),

/***/ "./src/main/PatchMakeGroupTool.ts":
/*!****************************************!*\
  !*** ./src/main/PatchMakeGroupTool.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   patchMakeGroup: () => (/* binding */ patchMakeGroup)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/main/utils.ts");

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
function patchMakeGroup() {
    var _a;
    const design = app.getActiveDesign();
    const selection = app.getSelection();
    const allEntities = selection.getAllEntities();
    const allFaces = [];
    for (const entity of allEntities) {
        if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isKFace)(entity)) {
            allFaces.push(entity);
        }
    }
    const groupFaces = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.groupFacesByConnection)(allFaces);
    if (groupFaces.length) {
        const newGroupInstances = [];
        design.startOperation();
        let operationSuccess = false;
        for (const patch of groupFaces) {
            const newGroupInstance = (_a = design.makeGroup(patch, [], [])) === null || _a === void 0 ? void 0 : _a.addedInstance;
            if (newGroupInstance) {
                operationSuccess = true;
                newGroupInstances.push(newGroupInstance);
            }
            else {
                operationSuccess = false;
                break;
            }
        }
        if (operationSuccess) {
            design.commitOperation();
        }
        else {
            design.abortOperation();
        }
    }
}


/***/ }),

/***/ "./src/main/utils.ts":
/*!***************************!*\
  !*** ./src/main/utils.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   groupFacesByConnection: () => (/* binding */ groupFacesByConnection),
/* harmony export */   isKArc3d: () => (/* binding */ isKArc3d),
/* harmony export */   isKArchFace: () => (/* binding */ isKArchFace),
/* harmony export */   isKAuxiliaryBoundedCurve: () => (/* binding */ isKAuxiliaryBoundedCurve),
/* harmony export */   isKAuxiliaryLine: () => (/* binding */ isKAuxiliaryLine),
/* harmony export */   isKEdge: () => (/* binding */ isKEdge),
/* harmony export */   isKFace: () => (/* binding */ isKFace),
/* harmony export */   isKGroupInstance: () => (/* binding */ isKGroupInstance),
/* harmony export */   isKLineSegment3d: () => (/* binding */ isKLineSegment3d),
/* harmony export */   isKPlane: () => (/* binding */ isKPlane),
/* harmony export */   isKVertex: () => (/* binding */ isKVertex)
/* harmony export */ });
function isKArchFace(entity) {
    return !!entity && (entity.getType() === KArchFaceType.NonPlanar || entity.getType() === KArchFaceType.Planar);
}
function isKGroupInstance(entity) {
    return !!entity && entity.getType() === KEntityType.GroupInstance;
}
function isKFace(entity) {
    return !!entity && entity.getType() === KEntityType.Face;
}
function isKEdge(entity) {
    return !!entity && entity.getType() === KEntityType.Edge;
}
function isKVertex(entity) {
    return !!entity && entity.getType() === KEntityType.Vertex;
}
function isKAuxiliaryBoundedCurve(entity) {
    return !!entity && entity.getType() === KEntityType.AuxiliaryBoundedCurve;
}
function isKAuxiliaryLine(entity) {
    return !!entity && entity.getType() === KEntityType.AuxiliaryLine;
}
function isKPlane(entity) {
    return !!entity && entity.getType() === KSurfaceType.Plane;
}
function isKLineSegment3d(entity) {
    return !!entity && !!entity.direction;
}
function isKArc3d(entity) {
    return !!entity && !!entity.circle;
}
function groupFacesByConnection(faces) {
    if (faces.length < 1) {
        return [];
    }
    if (faces.length < 2) {
        return [faces];
    }
    const edgeFaceIds = new Map();
    const faceIndMap = faces.reduce((map, f, i) => {
        const faceKey = f.getKey();
        map.set(faceKey, i);
        f.getEdges().forEach(edge => {
            const edgeKey = edge.getKey();
            let theFaceIds = edgeFaceIds.get(edgeKey);
            if (!theFaceIds) {
                theFaceIds = [];
                edgeFaceIds.set(edgeKey, theFaceIds);
            }
            theFaceIds.push(faceKey);
        });
        return map;
    }, new Map());
    const fineParent = (ind) => {
        let theInd = ind;
        let p = parents[ind];
        while (p !== theInd) {
            theInd = p;
            p = parents[theInd];
        }
        return p;
    };
    const union = (ind1, ind2) => {
        const p1 = fineParent(ind1);
        const p2 = fineParent(ind2);
        const r1 = ranks[p1];
        const r2 = ranks[p2];
        if (r1 < r2) {
            parents[p1] = p2;
        }
        else {
            parents[p2] = p1;
            if (r1 === r2) {
                ranks[p1] += 1;
            }
        }
    };
    const adjFaceMap = new Map();
    for (const f of faces) {
        const faceId = f.getKey();
        const faceInd = faceIndMap.get(faceId);
        const edgeKeys = f.getEdges().map(e => e.getKey());
        if (faceInd !== undefined) {
            for (const edgeKey of edgeKeys) {
                const adjFaceIds = edgeFaceIds.get(edgeKey);
                if (!adjFaceIds || !adjFaceIds.length) {
                    continue;
                }
                for (const adjId of adjFaceIds) {
                    const ind = faceIndMap.get(adjId);
                    if (ind !== undefined && faceInd !== ind) {
                        let adjSet = adjFaceMap.get(faceInd);
                        if (!adjSet) {
                            adjSet = new Set();
                            adjFaceMap.set(faceInd, adjSet);
                        }
                        adjSet.add(ind);
                    }
                }
            }
        }
    }
    const parents = Array.from({ length: faces.length }, (_, i) => i);
    const ranks = Array.from({ length: faces.length }, _ => 1);
    for (const [fInd, inds] of adjFaceMap) {
        for (const ind of inds) {
            union(fineParent(fInd), fineParent(ind));
        }
    }
    const ps = new Map();
    for (let i = 0; i < faces.length; i++) {
        const parentInd = fineParent(i);
        let patchFaces = ps.get(parentInd);
        if (!patchFaces) {
            patchFaces = [];
            ps.set(parentInd, patchFaces);
        }
        patchFaces.push(faces[i]);
    }
    const result = [];
    for (const [, patch] of ps) {
        result.push(patch);
    }
    return result;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**************************!*\
  !*** ./src/main/main.ts ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _AlignTool__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AlignTool */ "./src/main/AlignTool.ts");
/* harmony import */ var _PatchMakeGroupTool__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PatchMakeGroupTool */ "./src/main/PatchMakeGroupTool.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const pluginUI = app.getPluginUI();
pluginUI.resize(240, 700);
pluginUI.mount();
let activatedCustomTool;
function onUIMessage(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if ((_a = data.type) === null || _a === void 0 ? void 0 : _a.startsWith('activate')) {
                if (activatedCustomTool) {
                    app.deactivateCustomTool(activatedCustomTool, true);
                }
            }
            if (data.type === 'activateAlignTool') {
                app.activateCustomTool(_AlignTool__WEBPACK_IMPORTED_MODULE_0__.alignTool, true);
                activatedCustomTool = _AlignTool__WEBPACK_IMPORTED_MODULE_0__.alignTool;
            }
            else if (data.type === 'deActivateAlignTool') {
                app.deactivateCustomTool(_AlignTool__WEBPACK_IMPORTED_MODULE_0__.alignTool, false);
                activatedCustomTool = undefined;
            }
            if (data.type === 'activatePatchMakeGroupTool') {
                if (activatedCustomTool) {
                    app.deactivateCustomTool(activatedCustomTool, true);
                }
                (0,_PatchMakeGroupTool__WEBPACK_IMPORTED_MODULE_1__.patchMakeGroup)();
            }
            else if (data.type === 'deActivatePatchMakeGroupTool') {
                // app.deactivateCustomTool(patchMakeGroupTool, false);
                activatedCustomTool = undefined;
            }
        }
        catch (error) {
            console.error(error);
            closePlugin();
        }
    });
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOQSxpQkFBaUIsU0FBSSxJQUFJLFNBQUk7QUFDN0IsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDd0M7QUFDYztBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLGlEQUFTO0FBQ2hELHNDQUFzQyxpREFBUztBQUMvQztBQUNBO0FBQ0EseUNBQXlDLGlEQUFTO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixtRUFBYztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8va2RzLXRvb2wtYXNzZXQvLi9zcmMvbWFpbi9BbGlnblRvb2wudHMiLCJ3ZWJwYWNrOi8va2RzLXRvb2wtYXNzZXQvLi9zcmMvbWFpbi9QYXRjaE1ha2VHcm91cFRvb2wudHMiLCJ3ZWJwYWNrOi8va2RzLXRvb2wtYXNzZXQvLi9zcmMvbWFpbi91dGlscy50cyIsIndlYnBhY2s6Ly9rZHMtdG9vbC1hc3NldC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9rZHMtdG9vbC1hc3NldC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8va2RzLXRvb2wtYXNzZXQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9rZHMtdG9vbC1hc3NldC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2tkcy10b29sLWFzc2V0Ly4vc3JjL21haW4vbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc0tBcmMzZCwgaXNLQXJjaEZhY2UsIGlzS0F1eGlsaWFyeUJvdW5kZWRDdXJ2ZSwgaXNLQXV4aWxpYXJ5TGluZSwgaXNLRWRnZSwgaXNLRmFjZSwgaXNLR3JvdXBJbnN0YW5jZSwgaXNLUGxhbmUsIGlzS1ZlcnRleCB9IGZyb20gXCIuL3V0aWxzXCI7XG52YXIgU3RhZ2U7XG4oZnVuY3Rpb24gKFN0YWdlKSB7XG4gICAgU3RhZ2VbU3RhZ2VbXCJQaWNrVXBNb2RlbFwiXSA9IDBdID0gXCJQaWNrVXBNb2RlbFwiO1xuICAgIFN0YWdlW1N0YWdlW1wiUGlja1VwVGFyZ2V0XCJdID0gMV0gPSBcIlBpY2tVcFRhcmdldFwiO1xufSkoU3RhZ2UgfHwgKFN0YWdlID0ge30pKTtcbmV4cG9ydCBjbGFzcyBBbGlnblRvb2wge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnN0YWdlID0gU3RhZ2UuUGlja1VwTW9kZWw7XG4gICAgfVxuICAgIG9uVG9vbEFjdGl2ZSgpIHtcbiAgICB9XG4gICAgb25Ub29sRGVhY3RpdmUoKSB7XG4gICAgICAgIGNvbnN0IHBsdWdpblVJID0gYXBwLmdldFBsdWdpblVJKCk7XG4gICAgICAgIHRoaXMudHJ5Q29tbWl0KCk7XG4gICAgICAgIHBsdWdpblVJLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2xlYXZlQWxpZ25Ub29sJyB9LCAnKicpO1xuICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgfVxuICAgIG9uTW91c2VNb3ZlKGV2ZW50LCBpbmZlcmVuY2VSZXN1bHQpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2YsIF9nLCBfaCwgX2osIF9rLCBfbCwgX207XG4gICAgICAgIGNvbnN0IGVudGl0eSA9IGluZmVyZW5jZVJlc3VsdCA9PT0gbnVsbCB8fCBpbmZlcmVuY2VSZXN1bHQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGluZmVyZW5jZVJlc3VsdC5lbnRpdHk7XG4gICAgICAgIGNvbnN0IGFwcFZpZXcgPSBhcHAuZ2V0QWN0aXZlVmlldygpO1xuICAgICAgICBjb25zdCBjdXJNb2RlbCA9IHRoaXMuc3RhZ2UgPT09IFN0YWdlLlBpY2tVcE1vZGVsID8gdGhpcy5tb2RlbCA6IHRoaXMudGFyZ2V0TW9kZWw7XG4gICAgICAgIGlmIChlbnRpdHkpIHtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IGluZmVyZW5jZVJlc3VsdC5pbnN0YW5jZVBhdGgucmVkdWNlKChhY2MsIGluc3RhbmNlKSA9PiB7XG4gICAgICAgICAgICAgICAgYWNjLm11bHRpcGx5KGluc3RhbmNlLmdldFRyYW5zZm9ybSgpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgfSwgR2VvbUxpYi5jcmVhdGVJZGVudGl0eU1hdHJpeDQoKSk7XG4gICAgICAgICAgICBsZXQgaW5mZXJlbmNlTW9kZWw7XG4gICAgICAgICAgICBpZiAoaXNLRmFjZShlbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3VyZmFjZSA9IGVudGl0eS5nZXRTdXJmYWNlKCk7XG4gICAgICAgICAgICAgICAgaWYgKGlzS1BsYW5lKHN1cmZhY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNLRmFjZShjdXJNb2RlbCA9PT0gbnVsbCB8fCBjdXJNb2RlbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VyTW9kZWwuaW5mZXJlbmNlRW50aXR5KSB8fCAoY3VyTW9kZWwgPT09IG51bGwgfHwgY3VyTW9kZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1ck1vZGVsLmluZmVyZW5jZUVudGl0eS5nZXRLZXkoKSkgIT09IGVudGl0eS5nZXRLZXkoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9ybWFsID0gaW5mZXJlbmNlUmVzdWx0Lm5vcm1hbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnN0IG5vcm1hbCA9IHN1cmZhY2Uubm9ybWFsLmFwcGxpZWRNYXRyaXg0KHRyYW5zZm9ybSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmYWNlVmVydGV4UG9pbnRzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBlbnRpdHkuZ2V0VmVydGljZXMoKS5mb3JFYWNoKHZlcnRleCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9pbnQgPSB2ZXJ0ZXguZ2V0UG9pbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocG9pbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFjZVZlcnRleFBvaW50cy5wdXNoKHBvaW50LmFwcGxpZWRNYXRyaXg0KHRyYW5zZm9ybSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5mZXJlbmNlTW9kZWwgPSB7IHBvc2l0aW9uOiBpbmZlcmVuY2VSZXN1bHQucG9zaXRpb24sIGluZmVyZW5jZUVudGl0eTogZW50aXR5LCBub3JtYWwsIHBhdGg6IGluZmVyZW5jZVJlc3VsdC5pbnN0YW5jZVBhdGggfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJNb2RlbCA9PT0gbnVsbCB8fCBjdXJNb2RlbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VyTW9kZWwudGVtcFNoYXBlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBWaWV3LmNsZWFyVGVtcG9yYXJ5U2hhcGVzQnlJZHMoW2N1ck1vZGVsLnRlbXBTaGFwZUlkXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmFjZVZlcnRleFBvaW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFjZVZlcnRleFBvaW50cy5wdXNoKGZhY2VWZXJ0ZXhQb2ludHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBTaGFwZUlkID0gKF9hID0gYXBwVmlldy5kcmF3RmxhdExpbmVzKFtmYWNlVmVydGV4UG9pbnRzXSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogeyByOiAyNTUsIGc6IDAsIGI6IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybjogS0xpbmVQYXR0ZXJuLlNvbGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuaWRzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZmVyZW5jZU1vZGVsLnRlbXBTaGFwZUlkID0gdGVtcFNoYXBlSWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGFnZSA9PT0gU3RhZ2UuUGlja1VwTW9kZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGVsID0gaW5mZXJlbmNlTW9kZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhcmdldE1vZGVsID0gaW5mZXJlbmNlTW9kZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY3VyTW9kZWwucG9zaXRpb24gPSBpbmZlcmVuY2VSZXN1bHQucG9zaXRpb247XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0tFZGdlKGVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwMCA9IChfYiA9IGVudGl0eS5nZXRWZXJ0ZXhBKCkpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5nZXRQb2ludCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHAxID0gKF9jID0gZW50aXR5LmdldFZlcnRleEIoKSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLmdldFBvaW50KCk7XG4gICAgICAgICAgICAgICAgaWYgKHAwICYmIHAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNLRWRnZShjdXJNb2RlbCA9PT0gbnVsbCB8fCBjdXJNb2RlbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VyTW9kZWwuaW5mZXJlbmNlRW50aXR5KSB8fCAoY3VyTW9kZWwgPT09IG51bGwgfHwgY3VyTW9kZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1ck1vZGVsLmluZmVyZW5jZUVudGl0eS5nZXRLZXkoKSkgIT09IGVudGl0eS5nZXRLZXkoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9pbnRzID0gW3AwLmFwcGxpZWRNYXRyaXg0KHRyYW5zZm9ybSksIHAxLmFwcGxpZWRNYXRyaXg0KHRyYW5zZm9ybSldO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gcG9pbnRzWzFdLnN1YnRyYWN0ZWQocG9pbnRzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZmVyZW5jZU1vZGVsID0geyBwb3NpdGlvbjogaW5mZXJlbmNlUmVzdWx0LnBvc2l0aW9uLCBpbmZlcmVuY2VFbnRpdHk6IGVudGl0eSwgZGlyZWN0aW9uLCBwYXRoOiBpbmZlcmVuY2VSZXN1bHQuaW5zdGFuY2VQYXRoLCB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ck1vZGVsID09PSBudWxsIHx8IGN1ck1vZGVsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJNb2RlbC50ZW1wU2hhcGVJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcFZpZXcuY2xlYXJUZW1wb3JhcnlTaGFwZXNCeUlkcyhbY3VyTW9kZWwudGVtcFNoYXBlSWRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBTaGFwZUlkID0gKF9kID0gYXBwVmlldy5kcmF3RmxhdExpbmVzKFtwb2ludHNdLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHsgcjogMjU1LCBnOiAwLCBiOiAwIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybjogS0xpbmVQYXR0ZXJuLlNvbGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC5pZHNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZlcmVuY2VNb2RlbC50ZW1wU2hhcGVJZCA9IHRlbXBTaGFwZUlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhZ2UgPT09IFN0YWdlLlBpY2tVcE1vZGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbCA9IGluZmVyZW5jZU1vZGVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXRNb2RlbCA9IGluZmVyZW5jZU1vZGVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGN1ck1vZGVsLnBvc2l0aW9uID0gaW5mZXJlbmNlUmVzdWx0LnBvc2l0aW9uO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNLVmVydGV4KGVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwMCA9IGVudGl0eS5nZXRQb2ludCgpO1xuICAgICAgICAgICAgICAgIGlmIChwMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzS1ZlcnRleChjdXJNb2RlbCA9PT0gbnVsbCB8fCBjdXJNb2RlbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VyTW9kZWwuaW5mZXJlbmNlRW50aXR5KSB8fCAhKChfZSA9IGN1ck1vZGVsID09PSBudWxsIHx8IGN1ck1vZGVsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJNb2RlbC5pbmZlcmVuY2VFbnRpdHkuZ2V0UG9pbnQoKSkgPT09IG51bGwgfHwgX2UgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9lLmlzRXF1YWwocDApKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5mZXJlbmNlTW9kZWwgPSB7IHBvc2l0aW9uOiBpbmZlcmVuY2VSZXN1bHQucG9zaXRpb24sIGluZmVyZW5jZUVudGl0eTogZW50aXR5LCBwYXRoOiBpbmZlcmVuY2VSZXN1bHQuaW5zdGFuY2VQYXRoLCB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ck1vZGVsID09PSBudWxsIHx8IGN1ck1vZGVsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJNb2RlbC50ZW1wU2hhcGVJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcFZpZXcuY2xlYXJUZW1wb3JhcnlTaGFwZXNCeUlkcyhbY3VyTW9kZWwudGVtcFNoYXBlSWRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBTaGFwZUlkID0gKF9mID0gYXBwVmlldy5kcmF3UG9pbnRzKFtwMC5hcHBsaWVkTWF0cml4NCh0cmFuc2Zvcm0pXSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiB7IHI6IDI1NSwgZzogMCwgYjogMCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpID09PSBudWxsIHx8IF9mID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZi5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZmVyZW5jZU1vZGVsLnRlbXBTaGFwZUlkID0gdGVtcFNoYXBlSWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGFnZSA9PT0gU3RhZ2UuUGlja1VwTW9kZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGVsID0gaW5mZXJlbmNlTW9kZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhcmdldE1vZGVsID0gaW5mZXJlbmNlTW9kZWw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY3VyTW9kZWwucG9zaXRpb24gPSBpbmZlcmVuY2VSZXN1bHQucG9zaXRpb247XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0tBdXhpbGlhcnlCb3VuZGVkQ3VydmUoZW50aXR5KSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJvdW5kZWRDdXJ2ZSA9IGVudGl0eS5nZXRCb3VuZGVkQ3VydmUoKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNLQXJjM2QoYm91bmRlZEN1cnZlKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJ2ZVBvaW50cyA9IGJvdW5kZWRDdXJ2ZS5nZXRBcHByb3hpbWF0ZVBvaW50c0J5QW5nbGUoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnZlUG9pbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0tBdXhpbGlhcnlCb3VuZGVkQ3VydmUoY3VyTW9kZWwgPT09IG51bGwgfHwgY3VyTW9kZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1ck1vZGVsLmluZmVyZW5jZUVudGl0eSkgfHwgKGN1ck1vZGVsID09PSBudWxsIHx8IGN1ck1vZGVsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJNb2RlbC5pbmZlcmVuY2VFbnRpdHkuZ2V0S2V5KCkpICE9PSBlbnRpdHkuZ2V0S2V5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludHMgPSBjdXJ2ZVBvaW50cy5tYXAocCA9PiBwLmFwcGxpZWRNYXRyaXg0KHRyYW5zZm9ybSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vcm1hbCA9IGJvdW5kZWRDdXJ2ZS5ub3JtYWwuYXBwbGllZE1hdHJpeDQodHJhbnNmb3JtKS5ub3JtYWxpemVkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mZXJlbmNlTW9kZWwgPSB7IHBvc2l0aW9uOiBpbmZlcmVuY2VSZXN1bHQucG9zaXRpb24sIGluZmVyZW5jZUVudGl0eTogZW50aXR5LCBub3JtYWwsIHBhdGg6IGluZmVyZW5jZVJlc3VsdC5pbnN0YW5jZVBhdGgsIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ck1vZGVsID09PSBudWxsIHx8IGN1ck1vZGVsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJNb2RlbC50ZW1wU2hhcGVJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBWaWV3LmNsZWFyVGVtcG9yYXJ5U2hhcGVzQnlJZHMoW2N1ck1vZGVsLnRlbXBTaGFwZUlkXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBTaGFwZUlkID0gKF9nID0gYXBwVmlldy5kcmF3RmxhdExpbmVzKFtwb2ludHNdLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiB7IHI6IDI1NSwgZzogMCwgYjogMCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuOiBLTGluZVBhdHRlcm4uU29saWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpID09PSBudWxsIHx8IF9nID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZy5pZHNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mZXJlbmNlTW9kZWwudGVtcFNoYXBlSWQgPSB0ZW1wU2hhcGVJZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGFnZSA9PT0gU3RhZ2UuUGlja1VwTW9kZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbCA9IGluZmVyZW5jZU1vZGVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXRNb2RlbCA9IGluZmVyZW5jZU1vZGVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJNb2RlbC5wb3NpdGlvbiA9IGluZmVyZW5jZVJlc3VsdC5wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcDAgPSAoX2ggPSBlbnRpdHkuZ2V0U3RhcnRWZXJ0ZXgoKSkgPT09IG51bGwgfHwgX2ggPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9oLmdldFBvaW50KCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHAxID0gKF9qID0gZW50aXR5LmdldEVuZFZlcnRleCgpKSA9PT0gbnVsbCB8fCBfaiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2ouZ2V0UG9pbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHAwICYmIHAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzS0F1eGlsaWFyeUJvdW5kZWRDdXJ2ZShjdXJNb2RlbCA9PT0gbnVsbCB8fCBjdXJNb2RlbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VyTW9kZWwuaW5mZXJlbmNlRW50aXR5KSB8fCAoY3VyTW9kZWwgPT09IG51bGwgfHwgY3VyTW9kZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1ck1vZGVsLmluZmVyZW5jZUVudGl0eS5nZXRLZXkoKSkgIT09IGVudGl0eS5nZXRLZXkoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50cyA9IFtwMC5hcHBsaWVkTWF0cml4NCh0cmFuc2Zvcm0pLCBwMS5hcHBsaWVkTWF0cml4NCh0cmFuc2Zvcm0pXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSBwb2ludHNbMV0uc3VidHJhY3RlZChwb2ludHNbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZmVyZW5jZU1vZGVsID0geyBwb3NpdGlvbjogaW5mZXJlbmNlUmVzdWx0LnBvc2l0aW9uLCBpbmZlcmVuY2VFbnRpdHk6IGVudGl0eSwgZGlyZWN0aW9uLCBwYXRoOiBpbmZlcmVuY2VSZXN1bHQuaW5zdGFuY2VQYXRoLCB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJNb2RlbCA9PT0gbnVsbCB8fCBjdXJNb2RlbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VyTW9kZWwudGVtcFNoYXBlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwVmlldy5jbGVhclRlbXBvcmFyeVNoYXBlc0J5SWRzKFtjdXJNb2RlbC50ZW1wU2hhcGVJZF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW1wU2hhcGVJZCA9IChfayA9IGFwcFZpZXcuZHJhd0ZsYXRMaW5lcyhbcG9pbnRzXSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogeyByOiAyNTUsIGc6IDAsIGI6IDAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybjogS0xpbmVQYXR0ZXJuLlNvbGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKSA9PT0gbnVsbCB8fCBfayA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2suaWRzWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZmVyZW5jZU1vZGVsLnRlbXBTaGFwZUlkID0gdGVtcFNoYXBlSWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhZ2UgPT09IFN0YWdlLlBpY2tVcE1vZGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW9kZWwgPSBpbmZlcmVuY2VNb2RlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0TW9kZWwgPSBpbmZlcmVuY2VNb2RlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyTW9kZWwucG9zaXRpb24gPSBpbmZlcmVuY2VSZXN1bHQucG9zaXRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0tBdXhpbGlhcnlMaW5lKGVudGl0eSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5lID0gZW50aXR5LmdldExpbmUoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzS0F1eGlsaWFyeUxpbmUoY3VyTW9kZWwgPT09IG51bGwgfHwgY3VyTW9kZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1ck1vZGVsLmluZmVyZW5jZUVudGl0eSkgfHwgKGN1ck1vZGVsID09PSBudWxsIHx8IGN1ck1vZGVsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJNb2RlbC5pbmZlcmVuY2VFbnRpdHkuZ2V0S2V5KCkpICE9PSBlbnRpdHkuZ2V0S2V5KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBkaXJlY3Rpb246IGxpbmVEaXJlY3Rpb24sIG9yaWdpbiB9ID0gbGluZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9pbnRzID0gW29yaWdpbi5hZGRlZChsaW5lRGlyZWN0aW9uLm11bHRpcGxpZWQoMTAwMDAwKSkuYXBwbGllZE1hdHJpeDQodHJhbnNmb3JtKSwgb3JpZ2luLmFkZGVkKGxpbmVEaXJlY3Rpb24ubXVsdGlwbGllZCgtMTAwMDAwKSkuYXBwbGllZE1hdHJpeDQodHJhbnNmb3JtKV07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHBvaW50c1sxXS5zdWJ0cmFjdGVkKHBvaW50c1swXSk7XG4gICAgICAgICAgICAgICAgICAgIGluZmVyZW5jZU1vZGVsID0geyBwb3NpdGlvbjogaW5mZXJlbmNlUmVzdWx0LnBvc2l0aW9uLCBpbmZlcmVuY2VFbnRpdHk6IGVudGl0eSwgZGlyZWN0aW9uLCBwYXRoOiBpbmZlcmVuY2VSZXN1bHQuaW5zdGFuY2VQYXRoLCB9O1xuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyTW9kZWwgPT09IG51bGwgfHwgY3VyTW9kZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1ck1vZGVsLnRlbXBTaGFwZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBWaWV3LmNsZWFyVGVtcG9yYXJ5U2hhcGVzQnlJZHMoW2N1ck1vZGVsLnRlbXBTaGFwZUlkXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVtcFNoYXBlSWQgPSAoX2wgPSBhcHBWaWV3LmRyYXdGbGF0TGluZXMoW3BvaW50c10sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiB7IHI6IDI1NSwgZzogMCwgYjogMCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybjogS0xpbmVQYXR0ZXJuLlNvbGlkLFxuICAgICAgICAgICAgICAgICAgICB9KSkgPT09IG51bGwgfHwgX2wgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9sLmlkc1swXTtcbiAgICAgICAgICAgICAgICAgICAgaW5mZXJlbmNlTW9kZWwudGVtcFNoYXBlSWQgPSB0ZW1wU2hhcGVJZDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhZ2UgPT09IFN0YWdlLlBpY2tVcE1vZGVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGVsID0gaW5mZXJlbmNlTW9kZWw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhcmdldE1vZGVsID0gaW5mZXJlbmNlTW9kZWw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdXJNb2RlbC5wb3NpdGlvbiA9IGluZmVyZW5jZVJlc3VsdC5wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0tBcmNoRmFjZShlbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhZ2UgPT09IFN0YWdlLlBpY2tVcFRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdXJmYWNlID0gZW50aXR5LmdldFN1cmZhY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzS1BsYW5lKHN1cmZhY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb250b3VyID0gZW50aXR5LmdldEZhY2UzZCgpLmNvbnRvdXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBub3JtYWwgPSBpbmZlcmVuY2VSZXN1bHQubm9ybWFsO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc3Qgbm9ybWFsID0gc3VyZmFjZS5ub3JtYWwuYXBwbGllZE1hdHJpeDQodHJhbnNmb3JtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRvdXJQb2ludHMgPSBjb250b3VyLm1hcChzZWdtZW50ID0+IHNlZ21lbnQuc3RhcnRQb2ludCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZlcmVuY2VNb2RlbCA9IHsgcG9zaXRpb246IGluZmVyZW5jZVJlc3VsdC5wb3NpdGlvbiwgaW5mZXJlbmNlRW50aXR5OiBlbnRpdHksIG5vcm1hbCwgcGF0aDogaW5mZXJlbmNlUmVzdWx0Lmluc3RhbmNlUGF0aCB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ck1vZGVsID09PSBudWxsIHx8IGN1ck1vZGVsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJNb2RlbC50ZW1wU2hhcGVJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcFZpZXcuY2xlYXJUZW1wb3JhcnlTaGFwZXNCeUlkcyhbY3VyTW9kZWwudGVtcFNoYXBlSWRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250b3VyUG9pbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250b3VyUG9pbnRzLnB1c2goY29udG91clBvaW50c1swXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVtcFNoYXBlSWQgPSAoX20gPSBhcHBWaWV3LmRyYXdGbGF0TGluZXMoW2NvbnRvdXJQb2ludHNdLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiB7IHI6IDI1NSwgZzogMCwgYjogMCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuOiBLTGluZVBhdHRlcm4uU29saWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpID09PSBudWxsIHx8IF9tID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfbS5pZHNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mZXJlbmNlTW9kZWwudGVtcFNoYXBlSWQgPSB0ZW1wU2hhcGVJZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0TW9kZWwgPSBpbmZlcmVuY2VNb2RlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzS0dyb3VwSW5zdGFuY2UoZW50aXR5KSkge1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChjdXJNb2RlbCA9PT0gbnVsbCB8fCBjdXJNb2RlbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VyTW9kZWwudGVtcFNoYXBlSWQpIHtcbiAgICAgICAgICAgIGFwcFZpZXcuY2xlYXJUZW1wb3JhcnlTaGFwZXNCeUlkcyhbY3VyTW9kZWwudGVtcFNoYXBlSWRdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zdGFnZSA9PT0gU3RhZ2UuUGlja1VwTW9kZWwpIHtcbiAgICAgICAgICAgIHRoaXMubW9kZWwgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRhcmdldE1vZGVsID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfVxuICAgIG9uTEJ1dHRvblVwKGV2ZW50LCBpbmZlcmVuY2VSZXN1bHQpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhZ2UgPT09IFN0YWdlLlBpY2tVcE1vZGVsKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5tb2RlbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhZ2UgPSBTdGFnZS5QaWNrVXBUYXJnZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy50YXJnZXRNb2RlbCkge1xuICAgICAgICAgICAgICAgIGFwcC5kZWFjdGl2YXRlQ3VzdG9tVG9vbCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICB0cnlDb21taXQoKSB7XG4gICAgICAgIGlmICh0aGlzLm1vZGVsICYmIHRoaXMudGFyZ2V0TW9kZWwpIHtcbiAgICAgICAgICAgIGNvbnN0IGRlc2lnbiA9IGFwcC5nZXRBY3RpdmVEZXNpZ24oKTtcbiAgICAgICAgICAgIGNvbnN0IGVkaXRQYXRoID0gZGVzaWduLmdldEVkaXRQYXRoKCk7XG4gICAgICAgICAgICBjb25zdCBlZGl0VHJhbnNmb3JtID0gZWRpdFBhdGgucmVkdWNlKChhY2MsIGluc3RhbmNlKSA9PiB7XG4gICAgICAgICAgICAgICAgYWNjLm11bHRpcGx5KGluc3RhbmNlLmdldFRyYW5zZm9ybSgpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgICAgfSwgR2VvbUxpYi5jcmVhdGVJZGVudGl0eU1hdHJpeDQoKSk7XG4gICAgICAgICAgICBjb25zdCB7IHBvc2l0aW9uOiBtb2RlbFBvc2l0aW9uLCBpbmZlcmVuY2VFbnRpdHk6IG1vZGVsRW50aXR5LCBub3JtYWw6IG1vZGVsTm9ybWFsLCBkaXJlY3Rpb246IG1vZGVsRGlyZWN0aW9uLCBwYXRoOiBtb2RlbFBhdGggfSA9IHRoaXMubW9kZWw7XG4gICAgICAgICAgICBjb25zdCB7IHBvc2l0aW9uOiB0YXJnZXRQb3NpdGlvbiwgbm9ybWFsOiB0YXJnZXROb3JtYWwsIGRpcmVjdGlvbjogdGFyZ2V0RGlyZWN0aW9uIH0gPSB0aGlzLnRhcmdldE1vZGVsO1xuICAgICAgICAgICAgY29uc3QgbWF0ID0gZWRpdFRyYW5zZm9ybS5pbnZlcnNlZCgpLm11bHRpcGxpZWQoR2VvbUxpYi5jcmVhdGVUcmFuc2xhdGlvbk1hdHJpeDQodGFyZ2V0UG9zaXRpb24ueCAtIG1vZGVsUG9zaXRpb24ueCwgdGFyZ2V0UG9zaXRpb24ueSAtIG1vZGVsUG9zaXRpb24ueSwgdGFyZ2V0UG9zaXRpb24ueiAtIG1vZGVsUG9zaXRpb24ueikpO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0Tm9ybWFsUmV2ZXJzZSA9IHRhcmdldE5vcm1hbCA9PT0gbnVsbCB8fCB0YXJnZXROb3JtYWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHRhcmdldE5vcm1hbC5yZXZlcnNlZCgpO1xuICAgICAgICAgICAgaWYgKHRhcmdldE5vcm1hbFJldmVyc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAobW9kZWxOb3JtYWwgJiYgIW1vZGVsTm9ybWFsLmlzUGFyYWxsZWwodGFyZ2V0Tm9ybWFsUmV2ZXJzZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3Jvc3NWZWMgPSBtb2RlbE5vcm1hbC5jcm9zcyh0YXJnZXROb3JtYWxSZXZlcnNlKS5ub3JtYWxpemVkKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2VsID0gbW9kZWxOb3JtYWwuYW5nbGVUbyh0YXJnZXROb3JtYWxSZXZlcnNlLCBjcm9zc1ZlYyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvdGF0ZU1hdHJpeCA9IEdlb21MaWIuY3JlYXRlUm90YXRlTWF0cml4NChhbmdlbCwgY3Jvc3NWZWMsIHRoaXMubW9kZWwucG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBtYXQubXVsdGlwbHkocm90YXRlTWF0cml4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobW9kZWxEaXJlY3Rpb24gJiYgIW1vZGVsRGlyZWN0aW9uLmlzUGVycGVuZGljdWxhcih0YXJnZXROb3JtYWxSZXZlcnNlKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjcm9zc1ZlYzEgPSBtb2RlbERpcmVjdGlvbi5jcm9zcyh0YXJnZXROb3JtYWxSZXZlcnNlKS5ub3JtYWxpemVkKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2VsMSA9IG1vZGVsRGlyZWN0aW9uLmFuZ2xlVG8odGFyZ2V0Tm9ybWFsUmV2ZXJzZSwgY3Jvc3NWZWMxKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm90YXRlTWF0cml4MSA9IEdlb21MaWIuY3JlYXRlUm90YXRlTWF0cml4NChhbmdlbDEgLSBNYXRoLlBJIC8gMiAqIChhbmdlbDEgPiBNYXRoLlBJID8gMyA6IDEpLCBjcm9zc1ZlYzEsIHRoaXMubW9kZWwucG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBtYXQubXVsdGlwbHkocm90YXRlTWF0cml4MSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGFyZ2V0RGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vZGVsTm9ybWFsICYmICFtb2RlbE5vcm1hbC5pc1BlcnBlbmRpY3VsYXIodGFyZ2V0RGlyZWN0aW9uKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjcm9zc1ZlYzIgPSBtb2RlbE5vcm1hbC5jcm9zcyh0YXJnZXREaXJlY3Rpb24pLm5vcm1hbGl6ZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nZWwyID0gbW9kZWxOb3JtYWwuYW5nbGVUbyh0YXJnZXREaXJlY3Rpb24sIGNyb3NzVmVjMik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvdGF0ZU1hdHJpeDEgPSBHZW9tTGliLmNyZWF0ZVJvdGF0ZU1hdHJpeDQoYW5nZWwyIC0gTWF0aC5QSSAvIDIgKiAoYW5nZWwyID4gTWF0aC5QSSA/IDMgOiAxKSwgY3Jvc3NWZWMyLCB0aGlzLm1vZGVsLnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgbWF0Lm11bHRpcGx5KHJvdGF0ZU1hdHJpeDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChtb2RlbERpcmVjdGlvbiAmJiAhbW9kZWxEaXJlY3Rpb24uaXNQYXJhbGxlbCh0YXJnZXREaXJlY3Rpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNyb3NzVmVjMyA9IG1vZGVsRGlyZWN0aW9uLmNyb3NzKHRhcmdldERpcmVjdGlvbikubm9ybWFsaXplZCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdlbDMgPSBtb2RlbERpcmVjdGlvbi5hbmdsZVRvKHRhcmdldERpcmVjdGlvbiwgY3Jvc3NWZWMzKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm90YXRlTWF0cml4MSA9IEdlb21MaWIuY3JlYXRlUm90YXRlTWF0cml4NChhbmdlbDMgLSBNYXRoLlBJIC8gMiAqIChhbmdlbDMgPiBNYXRoLlBJID8gMyA6IDEpLCBjcm9zc1ZlYzMsIHRoaXMubW9kZWwucG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBtYXQubXVsdGlwbHkocm90YXRlTWF0cml4MSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWF0Lm11bHRpcGx5KGVkaXRUcmFuc2Zvcm0pO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0VG9UcmFuc2Zvcm0gPSBtb2RlbFBhdGguZmluZChpbnN0YW5jZSA9PiAhZWRpdFBhdGguc29tZShpbnMgPT4gaW5zLmdldEtleSgpID09PSBpbnN0YW5jZS5nZXRLZXkoKSkpIHx8IG1vZGVsRW50aXR5O1xuICAgICAgICAgICAgbGV0IHRyYW5zZm9ybVN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChpc0tGYWNlKHRhcmdldFRvVHJhbnNmb3JtKSB8fCBpc0tFZGdlKHRhcmdldFRvVHJhbnNmb3JtKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNoZWxsID0gdGFyZ2V0VG9UcmFuc2Zvcm0uZ2V0U2hlbGwoKTtcbiAgICAgICAgICAgICAgICBpZiAoc2hlbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtU3VjY2VzcyA9IGRlc2lnbi50cmFuc2Zvcm1TaGVsbHMoW3NoZWxsXSwgbWF0KS5pc1N1Y2Nlc3M7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNLVmVydGV4KHRhcmdldFRvVHJhbnNmb3JtKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNoZWxsID0gdGFyZ2V0VG9UcmFuc2Zvcm0uZ2V0RWRnZXMoKVswXS5nZXRTaGVsbCgpO1xuICAgICAgICAgICAgICAgIGlmIChzaGVsbCkge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1TdWNjZXNzID0gZGVzaWduLnRyYW5zZm9ybVNoZWxscyhbc2hlbGxdLCBtYXQpLmlzU3VjY2VzcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0tBdXhpbGlhcnlCb3VuZGVkQ3VydmUodGFyZ2V0VG9UcmFuc2Zvcm0pIHx8IGlzS0F1eGlsaWFyeUxpbmUodGFyZ2V0VG9UcmFuc2Zvcm0pKSB7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtU3VjY2VzcyA9IGRlc2lnbi50cmFuc2Zvcm1BdXhpbGlhcnlDdXJ2ZXMoW3RhcmdldFRvVHJhbnNmb3JtXSwgbWF0KS5pc1N1Y2Nlc3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0tHcm91cEluc3RhbmNlKHRhcmdldFRvVHJhbnNmb3JtKSkge1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybVN1Y2Nlc3MgPSBkZXNpZ24udHJhbnNmb3JtR3JvdXBJbnN0YW5jZXMoW3RhcmdldFRvVHJhbnNmb3JtXSwgbWF0KS5pc1N1Y2Nlc3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHJhbnNmb3JtU3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IGFwcC5nZXRTZWxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb24uYWRkKFt0YXJnZXRUb1RyYW5zZm9ybV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29uc3QgcGlja0hlbHBlciA9IGFwcC5nZXRQaWNrSGVscGVyKCk7XG4gICAgICAgICAgICAvLyAvLyBjb25zdCBwaWNrYWJsZUVudGl0eVR5cGUgPSB0aGlzLm1vZGVsID8gW0tFbnRpdHlUeXBlLkF1eGlsaWFyeUJvdW5kZWRDdXJ2ZV0gOiBbS0FwcEVudGl0eVR5cGUuR3JvdXBJbnN0YW5jZSwgS0VudGl0eVR5cGUuRmFjZV07XG4gICAgICAgICAgICAvLyBjb25zdCBhbGxQaWNrZWRFbnRpdGllcyA9IHBpY2tIZWxwZXIucGlja0J5UG9pbnQoZXZlbnQuY2xpZW50WCgpLCBldmVudC5jbGllbnRZKCkpLmdldEFsbFBpY2tlZCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNsZWFyKCkge1xuICAgICAgICBjb25zdCBhcHBWaWV3ID0gYXBwLmdldEFjdGl2ZVZpZXcoKTtcbiAgICAgICAgYXBwVmlldy5jbGVhclRlbXBvcmFyeVNoYXBlcygpO1xuICAgICAgICB0aGlzLm1vZGVsID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnRhcmdldE1vZGVsID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnN0YWdlID0gU3RhZ2UuUGlja1VwTW9kZWw7XG4gICAgfVxuICAgIG9uUkJ1dHRvblVwKGV2ZW50LCBpbmZlcmVuY2VSZXN1bHQpIHtcbiAgICAgICAgYXBwLmRlYWN0aXZhdGVDdXN0b21Ub29sKHRoaXMpO1xuICAgIH1cbiAgICBvbkxCdXR0b25EYkNsaWNrKGV2ZW50LCBpbmZlcmVuY2VSZXN1bHQpIHtcbiAgICAgICAgO1xuICAgIH1cbiAgICBhbGxvd1VzaW5nSW5mZXJlbmNlKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgb25LZXlEb3duKGV2ZW50KSB7XG4gICAgICAgIDtcbiAgICB9XG4gICAgb25LZXlVcChldmVudCkge1xuICAgICAgICA7XG4gICAgfVxufVxuZXhwb3J0IGNvbnN0IGFsaWduVG9vbCA9IG5ldyBBbGlnblRvb2woKTtcbiIsImltcG9ydCB7IGdyb3VwRmFjZXNCeUNvbm5lY3Rpb24sIGlzS0ZhY2UgfSBmcm9tIFwiLi91dGlsc1wiO1xuLy8gZXhwb3J0IGNsYXNzIFBhdGNoTWFrZUdyb3VwVG9vbCBpbXBsZW1lbnRzIEtUb29sIHtcbi8vICAgICBvblRvb2xBY3RpdmUoKTogdm9pZCB7XG4vLyAgICAgfVxuLy8gICAgIG9uVG9vbERlYWN0aXZlKCk6IHZvaWQge1xuLy8gIH1cbi8vICAgICBvbk1vdXNlTW92ZShldmVudDogS01vdXNlRXZlbnQsIGluZmVyZW5jZVJlc3VsdD86IEtJbmZlcmVuY2VSZXN1bHQpOiB2b2lkIHtcbi8vICAgICB9XG4vLyAgICAgb25MQnV0dG9uVXAoZXZlbnQ6IEtNb3VzZUV2ZW50LCBpbmZlcmVuY2VSZXN1bHQ/OiBLSW5mZXJlbmNlUmVzdWx0KTogdm9pZCB7XG4vLyAgICAgfVxuLy8gICAgIG9uUkJ1dHRvblVwKGV2ZW50OiBLTW91c2VFdmVudCwgaW5mZXJlbmNlUmVzdWx0PzogS0luZmVyZW5jZVJlc3VsdCk6IHZvaWQge1xuLy8gICAgICAgICBhcHAuZGVhY3RpdmF0ZUN1c3RvbVRvb2wodGhpcyk7XG4vLyAgICAgfVxuLy8gICAgIG9uTEJ1dHRvbkRiQ2xpY2soZXZlbnQ6IEtNb3VzZUV2ZW50LCBpbmZlcmVuY2VSZXN1bHQ/OiBLSW5mZXJlbmNlUmVzdWx0KTogdm9pZCB7XG4vLyAgICAgICAgIDtcbi8vICAgICB9XG4vLyAgICAgYWxsb3dVc2luZ0luZmVyZW5jZSgpOiBib29sZWFuIHtcbi8vICAgICAgICAgcmV0dXJuIHRydWU7XG4vLyAgICAgfVxuLy8gICAgIG9uS2V5RG93bihldmVudDogS0tleUJvYXJkRXZlbnQpOiB2b2lkIHtcbi8vICAgICAgICAgO1xuLy8gICAgIH1cbi8vICAgICBvbktleVVwKGV2ZW50OiBLS2V5Qm9hcmRFdmVudCk6IHZvaWQge1xuLy8gICAgICAgICA7XG4vLyAgICAgfVxuLy8gfVxuLy8gZXhwb3J0IGNvbnN0IHBhdGNoTWFrZUdyb3VwVG9vbCA9IG5ldyBQYXRjaE1ha2VHcm91cFRvb2woKTtcbmV4cG9ydCBmdW5jdGlvbiBwYXRjaE1ha2VHcm91cCgpIHtcbiAgICB2YXIgX2E7XG4gICAgY29uc3QgZGVzaWduID0gYXBwLmdldEFjdGl2ZURlc2lnbigpO1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGFwcC5nZXRTZWxlY3Rpb24oKTtcbiAgICBjb25zdCBhbGxFbnRpdGllcyA9IHNlbGVjdGlvbi5nZXRBbGxFbnRpdGllcygpO1xuICAgIGNvbnN0IGFsbEZhY2VzID0gW107XG4gICAgZm9yIChjb25zdCBlbnRpdHkgb2YgYWxsRW50aXRpZXMpIHtcbiAgICAgICAgaWYgKGlzS0ZhY2UoZW50aXR5KSkge1xuICAgICAgICAgICAgYWxsRmFjZXMucHVzaChlbnRpdHkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGdyb3VwRmFjZXMgPSBncm91cEZhY2VzQnlDb25uZWN0aW9uKGFsbEZhY2VzKTtcbiAgICBpZiAoZ3JvdXBGYWNlcy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgbmV3R3JvdXBJbnN0YW5jZXMgPSBbXTtcbiAgICAgICAgZGVzaWduLnN0YXJ0T3BlcmF0aW9uKCk7XG4gICAgICAgIGxldCBvcGVyYXRpb25TdWNjZXNzID0gZmFsc2U7XG4gICAgICAgIGZvciAoY29uc3QgcGF0Y2ggb2YgZ3JvdXBGYWNlcykge1xuICAgICAgICAgICAgY29uc3QgbmV3R3JvdXBJbnN0YW5jZSA9IChfYSA9IGRlc2lnbi5tYWtlR3JvdXAocGF0Y2gsIFtdLCBbXSkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hZGRlZEluc3RhbmNlO1xuICAgICAgICAgICAgaWYgKG5ld0dyb3VwSW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb25TdWNjZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBuZXdHcm91cEluc3RhbmNlcy5wdXNoKG5ld0dyb3VwSW5zdGFuY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uU3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvcGVyYXRpb25TdWNjZXNzKSB7XG4gICAgICAgICAgICBkZXNpZ24uY29tbWl0T3BlcmF0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkZXNpZ24uYWJvcnRPcGVyYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBpc0tBcmNoRmFjZShlbnRpdHkpIHtcbiAgICByZXR1cm4gISFlbnRpdHkgJiYgKGVudGl0eS5nZXRUeXBlKCkgPT09IEtBcmNoRmFjZVR5cGUuTm9uUGxhbmFyIHx8IGVudGl0eS5nZXRUeXBlKCkgPT09IEtBcmNoRmFjZVR5cGUuUGxhbmFyKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0tHcm91cEluc3RhbmNlKGVudGl0eSkge1xuICAgIHJldHVybiAhIWVudGl0eSAmJiBlbnRpdHkuZ2V0VHlwZSgpID09PSBLRW50aXR5VHlwZS5Hcm91cEluc3RhbmNlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzS0ZhY2UoZW50aXR5KSB7XG4gICAgcmV0dXJuICEhZW50aXR5ICYmIGVudGl0eS5nZXRUeXBlKCkgPT09IEtFbnRpdHlUeXBlLkZhY2U7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNLRWRnZShlbnRpdHkpIHtcbiAgICByZXR1cm4gISFlbnRpdHkgJiYgZW50aXR5LmdldFR5cGUoKSA9PT0gS0VudGl0eVR5cGUuRWRnZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0tWZXJ0ZXgoZW50aXR5KSB7XG4gICAgcmV0dXJuICEhZW50aXR5ICYmIGVudGl0eS5nZXRUeXBlKCkgPT09IEtFbnRpdHlUeXBlLlZlcnRleDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0tBdXhpbGlhcnlCb3VuZGVkQ3VydmUoZW50aXR5KSB7XG4gICAgcmV0dXJuICEhZW50aXR5ICYmIGVudGl0eS5nZXRUeXBlKCkgPT09IEtFbnRpdHlUeXBlLkF1eGlsaWFyeUJvdW5kZWRDdXJ2ZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0tBdXhpbGlhcnlMaW5lKGVudGl0eSkge1xuICAgIHJldHVybiAhIWVudGl0eSAmJiBlbnRpdHkuZ2V0VHlwZSgpID09PSBLRW50aXR5VHlwZS5BdXhpbGlhcnlMaW5lO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzS1BsYW5lKGVudGl0eSkge1xuICAgIHJldHVybiAhIWVudGl0eSAmJiBlbnRpdHkuZ2V0VHlwZSgpID09PSBLU3VyZmFjZVR5cGUuUGxhbmU7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNLTGluZVNlZ21lbnQzZChlbnRpdHkpIHtcbiAgICByZXR1cm4gISFlbnRpdHkgJiYgISFlbnRpdHkuZGlyZWN0aW9uO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzS0FyYzNkKGVudGl0eSkge1xuICAgIHJldHVybiAhIWVudGl0eSAmJiAhIWVudGl0eS5jaXJjbGU7XG59XG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBGYWNlc0J5Q29ubmVjdGlvbihmYWNlcykge1xuICAgIGlmIChmYWNlcy5sZW5ndGggPCAxKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgaWYgKGZhY2VzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIFtmYWNlc107XG4gICAgfVxuICAgIGNvbnN0IGVkZ2VGYWNlSWRzID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IGZhY2VJbmRNYXAgPSBmYWNlcy5yZWR1Y2UoKG1hcCwgZiwgaSkgPT4ge1xuICAgICAgICBjb25zdCBmYWNlS2V5ID0gZi5nZXRLZXkoKTtcbiAgICAgICAgbWFwLnNldChmYWNlS2V5LCBpKTtcbiAgICAgICAgZi5nZXRFZGdlcygpLmZvckVhY2goZWRnZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlZGdlS2V5ID0gZWRnZS5nZXRLZXkoKTtcbiAgICAgICAgICAgIGxldCB0aGVGYWNlSWRzID0gZWRnZUZhY2VJZHMuZ2V0KGVkZ2VLZXkpO1xuICAgICAgICAgICAgaWYgKCF0aGVGYWNlSWRzKSB7XG4gICAgICAgICAgICAgICAgdGhlRmFjZUlkcyA9IFtdO1xuICAgICAgICAgICAgICAgIGVkZ2VGYWNlSWRzLnNldChlZGdlS2V5LCB0aGVGYWNlSWRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoZUZhY2VJZHMucHVzaChmYWNlS2V5KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgfSwgbmV3IE1hcCgpKTtcbiAgICBjb25zdCBmaW5lUGFyZW50ID0gKGluZCkgPT4ge1xuICAgICAgICBsZXQgdGhlSW5kID0gaW5kO1xuICAgICAgICBsZXQgcCA9IHBhcmVudHNbaW5kXTtcbiAgICAgICAgd2hpbGUgKHAgIT09IHRoZUluZCkge1xuICAgICAgICAgICAgdGhlSW5kID0gcDtcbiAgICAgICAgICAgIHAgPSBwYXJlbnRzW3RoZUluZF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHA7XG4gICAgfTtcbiAgICBjb25zdCB1bmlvbiA9IChpbmQxLCBpbmQyKSA9PiB7XG4gICAgICAgIGNvbnN0IHAxID0gZmluZVBhcmVudChpbmQxKTtcbiAgICAgICAgY29uc3QgcDIgPSBmaW5lUGFyZW50KGluZDIpO1xuICAgICAgICBjb25zdCByMSA9IHJhbmtzW3AxXTtcbiAgICAgICAgY29uc3QgcjIgPSByYW5rc1twMl07XG4gICAgICAgIGlmIChyMSA8IHIyKSB7XG4gICAgICAgICAgICBwYXJlbnRzW3AxXSA9IHAyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50c1twMl0gPSBwMTtcbiAgICAgICAgICAgIGlmIChyMSA9PT0gcjIpIHtcbiAgICAgICAgICAgICAgICByYW5rc1twMV0gKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgYWRqRmFjZU1hcCA9IG5ldyBNYXAoKTtcbiAgICBmb3IgKGNvbnN0IGYgb2YgZmFjZXMpIHtcbiAgICAgICAgY29uc3QgZmFjZUlkID0gZi5nZXRLZXkoKTtcbiAgICAgICAgY29uc3QgZmFjZUluZCA9IGZhY2VJbmRNYXAuZ2V0KGZhY2VJZCk7XG4gICAgICAgIGNvbnN0IGVkZ2VLZXlzID0gZi5nZXRFZGdlcygpLm1hcChlID0+IGUuZ2V0S2V5KCkpO1xuICAgICAgICBpZiAoZmFjZUluZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVkZ2VLZXkgb2YgZWRnZUtleXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhZGpGYWNlSWRzID0gZWRnZUZhY2VJZHMuZ2V0KGVkZ2VLZXkpO1xuICAgICAgICAgICAgICAgIGlmICghYWRqRmFjZUlkcyB8fCAhYWRqRmFjZUlkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYWRqSWQgb2YgYWRqRmFjZUlkcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmQgPSBmYWNlSW5kTWFwLmdldChhZGpJZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmQgIT09IHVuZGVmaW5lZCAmJiBmYWNlSW5kICE9PSBpbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhZGpTZXQgPSBhZGpGYWNlTWFwLmdldChmYWNlSW5kKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYWRqU2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRqU2V0ID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkakZhY2VNYXAuc2V0KGZhY2VJbmQsIGFkalNldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBhZGpTZXQuYWRkKGluZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcGFyZW50cyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IGZhY2VzLmxlbmd0aCB9LCAoXywgaSkgPT4gaSk7XG4gICAgY29uc3QgcmFua3MgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiBmYWNlcy5sZW5ndGggfSwgXyA9PiAxKTtcbiAgICBmb3IgKGNvbnN0IFtmSW5kLCBpbmRzXSBvZiBhZGpGYWNlTWFwKSB7XG4gICAgICAgIGZvciAoY29uc3QgaW5kIG9mIGluZHMpIHtcbiAgICAgICAgICAgIHVuaW9uKGZpbmVQYXJlbnQoZkluZCksIGZpbmVQYXJlbnQoaW5kKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgcHMgPSBuZXcgTWFwKCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmYWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBwYXJlbnRJbmQgPSBmaW5lUGFyZW50KGkpO1xuICAgICAgICBsZXQgcGF0Y2hGYWNlcyA9IHBzLmdldChwYXJlbnRJbmQpO1xuICAgICAgICBpZiAoIXBhdGNoRmFjZXMpIHtcbiAgICAgICAgICAgIHBhdGNoRmFjZXMgPSBbXTtcbiAgICAgICAgICAgIHBzLnNldChwYXJlbnRJbmQsIHBhdGNoRmFjZXMpO1xuICAgICAgICB9XG4gICAgICAgIHBhdGNoRmFjZXMucHVzaChmYWNlc1tpXSk7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgIGZvciAoY29uc3QgWywgcGF0Y2hdIG9mIHBzKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKHBhdGNoKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5pbXBvcnQgeyBhbGlnblRvb2wgfSBmcm9tIFwiLi9BbGlnblRvb2xcIjtcbmltcG9ydCB7IHBhdGNoTWFrZUdyb3VwIH0gZnJvbSBcIi4vUGF0Y2hNYWtlR3JvdXBUb29sXCI7XG5jb25zdCBwbHVnaW5VSSA9IGFwcC5nZXRQbHVnaW5VSSgpO1xucGx1Z2luVUkucmVzaXplKDI0MCwgNzAwKTtcbnBsdWdpblVJLm1vdW50KCk7XG5sZXQgYWN0aXZhdGVkQ3VzdG9tVG9vbDtcbmZ1bmN0aW9uIG9uVUlNZXNzYWdlKGRhdGEpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICgoX2EgPSBkYXRhLnR5cGUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zdGFydHNXaXRoKCdhY3RpdmF0ZScpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2YXRlZEN1c3RvbVRvb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgYXBwLmRlYWN0aXZhdGVDdXN0b21Ub29sKGFjdGl2YXRlZEN1c3RvbVRvb2wsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkYXRhLnR5cGUgPT09ICdhY3RpdmF0ZUFsaWduVG9vbCcpIHtcbiAgICAgICAgICAgICAgICBhcHAuYWN0aXZhdGVDdXN0b21Ub29sKGFsaWduVG9vbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgYWN0aXZhdGVkQ3VzdG9tVG9vbCA9IGFsaWduVG9vbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGRhdGEudHlwZSA9PT0gJ2RlQWN0aXZhdGVBbGlnblRvb2wnKSB7XG4gICAgICAgICAgICAgICAgYXBwLmRlYWN0aXZhdGVDdXN0b21Ub29sKGFsaWduVG9vbCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGFjdGl2YXRlZEN1c3RvbVRvb2wgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGF0YS50eXBlID09PSAnYWN0aXZhdGVQYXRjaE1ha2VHcm91cFRvb2wnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2YXRlZEN1c3RvbVRvb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgYXBwLmRlYWN0aXZhdGVDdXN0b21Ub29sKGFjdGl2YXRlZEN1c3RvbVRvb2wsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwYXRjaE1ha2VHcm91cCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZGF0YS50eXBlID09PSAnZGVBY3RpdmF0ZVBhdGNoTWFrZUdyb3VwVG9vbCcpIHtcbiAgICAgICAgICAgICAgICAvLyBhcHAuZGVhY3RpdmF0ZUN1c3RvbVRvb2wocGF0Y2hNYWtlR3JvdXBUb29sLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgYWN0aXZhdGVkQ3VzdG9tVG9vbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgY2xvc2VQbHVnaW4oKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxucGx1Z2luVUkub25NZXNzYWdlKG9uVUlNZXNzYWdlKTtcbmNvbnN0IHNlbGVjdGlvbiA9IGFwcC5nZXRTZWxlY3Rpb24oKTtcbnNlbGVjdGlvbi5hZGRPYnNlcnZlcih7XG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6ICgpID0+IHtcbiAgICB9XG59KTtcbi8vIGZ1bmN0aW9uIG9uUGx1Z2luU3RhcnRVcCgpIHtcbi8vIH1cbi8vIG9uUGx1Z2luU3RhcnRVcCgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9