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
    // private pathPointPoses: PathPointPose[] = [];
    // private totalLength: number = 0;
    onToolActive() {
        // const selection = app.getSelection();
        // const toolHelper = app.getToolHelper();
        // toolHelper.enablePicking(true);
        // toolHelper.setDefaultSelectBehavior(KSelectBehavior.ADD);
        // const allEntities = selection.getAllEntities();
        // if (allEntities.length === 1 && (isKGroupInstance(allEntities[0]) || isKFace(allEntities[0]))) {
        //     this.model = allEntities[0];
        // } else {
        //     selection.clear();
        // }
    }
    onToolDeactive() {
        const pluginUI = app.getPluginUI();
        this.tryCommit();
        pluginUI.postMessage({ type: 'leaveAlignTool' }, '*');
        this.clear();
        // const toolHelper = app.getToolHelper();
        // toolHelper.enablePicking(false);
        // toolHelper.setDefaultSelectBehavior(KSelectBehavior.REPLACE);
    }
    onMouseMove(event, inferenceResult) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const entity = inferenceResult === null || inferenceResult === void 0 ? void 0 : inferenceResult.entity;
        console.log(entity);
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
                            points.push(points[0]);
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
            // console.log(allPickedEntities);
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
/* harmony export */   PatchMakeGroupTool: () => (/* binding */ PatchMakeGroupTool),
/* harmony export */   patchMakeGroupTool: () => (/* binding */ patchMakeGroupTool)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/main/utils.ts");

var Stage;
(function (Stage) {
    Stage[Stage["PickUpModel"] = 0] = "PickUpModel";
    Stage[Stage["PickUpTarget"] = 1] = "PickUpTarget";
})(Stage || (Stage = {}));
class PatchMakeGroupTool {
    constructor() {
        this.stage = Stage.PickUpModel;
    }
    // private pathPointPoses: PathPointPose[] = [];
    // private totalLength: number = 0;
    onToolActive() {
        // const selection = app.getSelection();
        // const toolHelper = app.getToolHelper();
        // toolHelper.enablePicking(true);
        // toolHelper.setDefaultSelectBehavior(KSelectBehavior.ADD);
        // const allEntities = selection.getAllEntities();
        // if (allEntities.length === 1 && (isKGroupInstance(allEntities[0]) || isKFace(allEntities[0]))) {
        //     this.model = allEntities[0];
        // } else {
        //     selection.clear();
        // }
    }
    onToolDeactive() {
        const pluginUI = app.getPluginUI();
        this.tryCommit();
        pluginUI.postMessage({ type: 'leaveAlignTool' }, '*');
        this.clear();
        // const toolHelper = app.getToolHelper();
        // toolHelper.enablePicking(false);
        // toolHelper.setDefaultSelectBehavior(KSelectBehavior.REPLACE);
    }
    onMouseMove(event, inferenceResult) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const entity = inferenceResult === null || inferenceResult === void 0 ? void 0 : inferenceResult.entity;
        console.log(entity);
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
                                gapSize: 0,
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
                            gapSize: 0,
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
                                gapSize: 0,
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
                                gapSize: 0,
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
                        gapSize: 0,
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
            // console.log(allPickedEntities);
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
const patchMakeGroupTool = new PatchMakeGroupTool();


/***/ }),

/***/ "./src/main/types.ts":
/*!***************************!*\
  !*** ./src/main/types.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ComponentPropertyKey: () => (/* binding */ ComponentPropertyKey),
/* harmony export */   CountPropertyKey: () => (/* binding */ CountPropertyKey),
/* harmony export */   DefaultPathArrayParams: () => (/* binding */ DefaultPathArrayParams),
/* harmony export */   IntervalPropertyKey: () => (/* binding */ IntervalPropertyKey),
/* harmony export */   ManualPrefix: () => (/* binding */ ManualPrefix),
/* harmony export */   NormalAxisPropertyKey: () => (/* binding */ NormalAxisPropertyKey),
/* harmony export */   PathAxisPropertyKey: () => (/* binding */ PathAxisPropertyKey),
/* harmony export */   PathDelimiter: () => (/* binding */ PathDelimiter),
/* harmony export */   PathListPropertyKey: () => (/* binding */ PathListPropertyKey),
/* harmony export */   PathReversedDelimiter: () => (/* binding */ PathReversedDelimiter),
/* harmony export */   ScalePropertyKey: () => (/* binding */ ScalePropertyKey),
/* harmony export */   dummyMatrix4: () => (/* binding */ dummyMatrix4),
/* harmony export */   dummyPoint3d: () => (/* binding */ dummyPoint3d),
/* harmony export */   dummyVector3d: () => (/* binding */ dummyVector3d),
/* harmony export */   isAxisValid: () => (/* binding */ isAxisValid)
/* harmony export */ });
const ComponentPropertyKey = 'PAComponent';
const IntervalPropertyKey = 'PAInterval';
const CountPropertyKey = 'PACount';
const PathAxisPropertyKey = 'PAPathAxis';
const NormalAxisPropertyKey = 'PANormalAxis';
const ScalePropertyKey = 'PAScale';
const PathListPropertyKey = 'PAPathList';
const PathReversedDelimiter = '-';
const PathDelimiter = '&';
const ManualPrefix = 'm';
function isAxisValid(axis) {
    return axis === "X" /* Axis.X */ || axis === "-X" /* Axis.XMinus */ || axis === "Y" /* Axis.Y */ || axis === "-Y" /* Axis.YMinus */ || axis === "Z" /* Axis.Z */ || axis === "-Z" /* Axis.ZMinus */;
}
const DefaultPathArrayParams = {
    interval: { value: 1000, min: 10, max: 9999999 },
    count: { value: 5, min: 1, max: 100 },
    pathAxis: "X" /* Axis.X */,
    normalAxis: "Z" /* Axis.Z */,
    scale: { value: 1, min: 0.01, max: 1000 },
};
const dummyMatrix4 = GeomLib.createIdentityMatrix4();
const dummyVector3d = GeomLib.createVector3d(0, 0, 1);
const dummyPoint3d = GeomLib.createPoint3d(0, 0, 0);


/***/ }),

/***/ "./src/main/utils.ts":
/*!***************************!*\
  !*** ./src/main/utils.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   boundedCurveConnectionDetect: () => (/* binding */ boundedCurveConnectionDetect),
/* harmony export */   discreteAuxiliaryBoundedCurve: () => (/* binding */ discreteAuxiliaryBoundedCurve),
/* harmony export */   findPathAfterMakeGroup: () => (/* binding */ findPathAfterMakeGroup),
/* harmony export */   generatePathPoses: () => (/* binding */ generatePathPoses),
/* harmony export */   getAuxiliaryBoundedCurveNormal: () => (/* binding */ getAuxiliaryBoundedCurveNormal),
/* harmony export */   getBoundingBoxSizeInWorld: () => (/* binding */ getBoundingBoxSizeInWorld),
/* harmony export */   getExtendedTransform: () => (/* binding */ getExtendedTransform),
/* harmony export */   getNormalByX: () => (/* binding */ getNormalByX),
/* harmony export */   getTransformFromPathPointPoses: () => (/* binding */ getTransformFromPathPointPoses),
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
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types */ "./src/main/types.ts");

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
function boundedCurveConnectionDetect(auxiliaryVertex, auxiliaryBoundedCurve) {
    const startVertex = auxiliaryBoundedCurve.getStartVertex();
    const endVertex = auxiliaryBoundedCurve.getStartVertex();
    if (startVertex.getKey() === auxiliaryVertex.getKey()) {
        return { connected: true, reversed: false };
    }
    else if (endVertex.getKey() === auxiliaryVertex.getKey()) {
        return { connected: true, reversed: true };
    }
    return { connected: false, reversed: false };
}
function discreteAuxiliaryBoundedCurve(auxiliaryBoundedCurve) {
    const boundedCurve = auxiliaryBoundedCurve.getBoundedCurve();
    let discretePoints = [];
    if (boundedCurve) {
        if (isKLineSegment3d(boundedCurve)) {
            discretePoints = [boundedCurve.startPoint, boundedCurve.endPoint];
        }
        else if (isKArc3d(boundedCurve)) {
            discretePoints = boundedCurve.getApproximatePointsByAngle();
        }
    }
    return discretePoints;
}
function getAuxiliaryBoundedCurveNormal(auxiliaryBoundedCurve) {
    const boundedCurve = auxiliaryBoundedCurve.getBoundedCurve();
    if (boundedCurve) {
        if (isKArc3d(boundedCurve)) {
            return boundedCurve.normal;
        }
    }
    return undefined;
}
function getNormalByX(xAxis) {
    if (xAxis.isParallel(_types__WEBPACK_IMPORTED_MODULE_0__.dummyVector3d)) {
        if (xAxis.z > 0) {
            return GeomLib.createVector3d(-1, 0, 0);
        }
        else {
            return GeomLib.createVector3d(1, 0, 0);
        }
    }
    else {
        return xAxis.cross(_types__WEBPACK_IMPORTED_MODULE_0__.dummyVector3d.cross(xAxis)).normalized();
    }
}
function generatePathPoses(path) {
    const pathPointPoses = [];
    let accumulateLength = 0;
    for (let i = 0; i < path.length; i++) {
        const pathObject = path[i];
        const discretePoints = discreteAuxiliaryBoundedCurve(pathObject.curve);
        if (discretePoints.length) {
            const boundedCurveNormal = getAuxiliaryBoundedCurveNormal(pathObject.curve);
            for (let j = 0; j < discretePoints.length; j++) {
                const discretePoint = discretePoints[j];
                if (j === 0) {
                    if (i === 0) {
                        const nextDiscretePoint = discretePoints[j + 1];
                        pathPointPoses.push({ point: discretePoints[0], direction: nextDiscretePoint.subtracted(discretePoint).normalized(), accumulateLength });
                    }
                }
                else {
                    const prevDiscretePoint = discretePoints[j - 1];
                    const direction = discretePoint.subtracted(prevDiscretePoint).normalized();
                    const segmentLength = prevDiscretePoint.distanceTo(discretePoint);
                    accumulateLength += segmentLength;
                    pathPointPoses.push({ point: discretePoint, direction, accumulateLength });
                }
                pathPointPoses[pathPointPoses.length - 1].normal = boundedCurveNormal ? boundedCurveNormal : getNormalByX(pathPointPoses[pathPointPoses.length - 1].direction);
            }
        }
    }
    return { pathPointPoses, totalLength: accumulateLength };
}
function getTransformFromPathPointPoses(pathPointPoses, params) {
    const { count, interval, scale, pathAxis, normalAxis } = params;
    const componentTransforms = [];
    const scaleMatrix = GeomLib.createScaleMatrix4(scale.value, scale.value, scale.value);
    let componentIndex = 0;
    let componentPositionLength = componentIndex * interval.value;
    for (let k = 0; k < pathPointPoses.length; k++) {
        const { point, normal, direction, accumulateLength } = pathPointPoses[k];
        const prevAccumulateLength = k === 0 ? -1 : pathPointPoses[k - 1].accumulateLength;
        let componentTransform;
        const pathNormal = normal || _types__WEBPACK_IMPORTED_MODULE_0__.dummyVector3d;
        let ccsX;
        let ccsY;
        let ccsZ;
        switch (pathAxis) {
            case "X" /* Axis.X */:
                ccsX = direction;
                break;
            case "-X" /* Axis.XMinus */:
                ccsX = direction.reversed();
                break;
            case "Y" /* Axis.Y */:
                ccsY = direction;
                break;
            case "-Y" /* Axis.YMinus */:
                ccsY = direction.reversed();
                break;
            case "Z" /* Axis.Z */:
                ccsZ = direction;
                break;
            case "-Z" /* Axis.ZMinus */:
                ccsZ = direction.reversed();
                break;
        }
        switch (normalAxis) {
            case "X" /* Axis.X */:
                ccsX = pathNormal;
                break;
            case "-X" /* Axis.XMinus */:
                ccsX = pathNormal.reversed();
                break;
            case "Y" /* Axis.Y */:
                ccsY = pathNormal;
                break;
            case "-Y" /* Axis.YMinus */:
                ccsY = pathNormal.reversed();
                break;
            case "Z" /* Axis.Z */:
                ccsZ = pathNormal;
                break;
            case "-Z" /* Axis.ZMinus */:
                ccsZ = pathNormal.reversed();
                break;
        }
        if (!ccsX) {
            ccsX = ccsY.cross(ccsZ);
        }
        if (!ccsY) {
            ccsY = ccsZ.cross(ccsX);
        }
        if (!ccsZ) {
            ccsZ = ccsX.cross(ccsY);
        }
        while (componentIndex < count.value && componentPositionLength > prevAccumulateLength && componentPositionLength <= accumulateLength) {
            const componentPosition = point.added(direction.multiplied(componentPositionLength - accumulateLength));
            componentTransform = GeomLib.createTranslationMatrix4(componentPosition.x, componentPosition.y, componentPosition.z)
                .multiplied(GeomLib.createAlignCCSMatrix4(ccsX, ccsY, ccsZ, _types__WEBPACK_IMPORTED_MODULE_0__.dummyPoint3d))
                .multiplied(scaleMatrix);
            componentTransforms.push(componentTransform);
            componentIndex++;
            componentPositionLength = componentIndex * interval.value;
        }
    }
    return componentTransforms;
}
function getBoundingBoxSizeInWorld(groupInstance) {
    const localBoundingBox = groupInstance.getLocalBoundingBox();
    const transform = groupInstance.getTransform();
    const oldSize = [GeomLib.createVector3d(localBoundingBox.width, 0, 0), GeomLib.createVector3d(0, localBoundingBox.height, 0), GeomLib.createVector3d(0, 0, localBoundingBox.depth)];
    return oldSize.map(vec => vec.appliedMatrix4(transform).length);
}
function getExtendedTransform() {
    const design = app.getActiveDesign();
    const editPath = design.getEditPath();
    const extendedTransform = GeomLib.createIdentityMatrix4();
    for (const path of editPath) {
        extendedTransform.multiply(path.getTransform());
    }
    return extendedTransform;
}
function findPathAfterMakeGroup(path, newGroupInstance) {
    var _a;
    const auxiliaryBoundedCurves = [];
    (_a = newGroupInstance.getGroupDefinition()) === null || _a === void 0 ? void 0 : _a.getAuxiliaryCurves().forEach(curve => {
        if (isKAuxiliaryBoundedCurve(curve)) {
            auxiliaryBoundedCurves.push(curve);
        }
    });
    const newPath = [];
    for (const { curve, reversed } of path) {
        const startPoint = curve.getStartVertex().getPoint();
        const endPoint = curve.getEndVertex().getPoint();
        const newCurveIndex = auxiliaryBoundedCurves.findIndex(newCurve => {
            const newStartPoint = newCurve.getStartVertex().getPoint();
            const newEndPoint = newCurve.getEndVertex().getPoint();
            if (newStartPoint.isEqual(startPoint) && newEndPoint.isEqual(endPoint)) {
                return true;
            }
            return false;
        });
        if (newCurveIndex > -1) {
            newPath.push({ curve: auxiliaryBoundedCurves[newCurveIndex], reversed });
            auxiliaryBoundedCurves.splice(newCurveIndex, 1);
        }
        else {
            return undefined;
        }
    }
    return newPath;
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
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (data.type === 'activateAlignTool') {
                app.activateCustomTool(_AlignTool__WEBPACK_IMPORTED_MODULE_0__.alignTool, true);
                activatedCustomTool = _AlignTool__WEBPACK_IMPORTED_MODULE_0__.alignTool;
            }
            else if (data.type === 'deActivateAlignTool') {
                app.deactivateCustomTool(_AlignTool__WEBPACK_IMPORTED_MODULE_0__.alignTool, false);
                activatedCustomTool = undefined;
                console.log(activatedCustomTool);
            }
            if (data.type === 'activatePatchMakeGroupTool') {
                app.activateCustomTool(_PatchMakeGroupTool__WEBPACK_IMPORTED_MODULE_1__.patchMakeGroupTool, true);
                activatedCustomTool = _AlignTool__WEBPACK_IMPORTED_MODULE_0__.alignTool;
            }
            else if (data.type === 'deActivatePatchMakeGroupTool') {
                app.deactivateCustomTool(_PatchMakeGroupTool__WEBPACK_IMPORTED_MODULE_1__.patchMakeGroupTool, false);
                activatedCustomTool = undefined;
                console.log(activatedCustomTool);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSwyQkFBMkIsd0RBQXdEO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7VUNqT0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7QUNOQSxpQkFBaUIsU0FBSSxJQUFJLFNBQUk7QUFDN0IsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDd0M7QUFDa0I7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxpREFBUztBQUNoRCxzQ0FBc0MsaURBQVM7QUFDL0M7QUFDQTtBQUNBLHlDQUF5QyxpREFBUztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxtRUFBa0I7QUFDekQsc0NBQXNDLGlEQUFTO0FBQy9DO0FBQ0E7QUFDQSx5Q0FBeUMsbUVBQWtCO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2tkcy10b29sLWFzc2V0Ly4vc3JjL21haW4vQWxpZ25Ub29sLnRzIiwid2VicGFjazovL2tkcy10b29sLWFzc2V0Ly4vc3JjL21haW4vUGF0Y2hNYWtlR3JvdXBUb29sLnRzIiwid2VicGFjazovL2tkcy10b29sLWFzc2V0Ly4vc3JjL21haW4vdHlwZXMudHMiLCJ3ZWJwYWNrOi8va2RzLXRvb2wtYXNzZXQvLi9zcmMvbWFpbi91dGlscy50cyIsIndlYnBhY2s6Ly9rZHMtdG9vbC1hc3NldC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9rZHMtdG9vbC1hc3NldC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8va2RzLXRvb2wtYXNzZXQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9rZHMtdG9vbC1hc3NldC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2tkcy10b29sLWFzc2V0Ly4vc3JjL21haW4vbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc0tBcmMzZCwgaXNLQXJjaEZhY2UsIGlzS0F1eGlsaWFyeUJvdW5kZWRDdXJ2ZSwgaXNLQXV4aWxpYXJ5TGluZSwgaXNLRWRnZSwgaXNLRmFjZSwgaXNLR3JvdXBJbnN0YW5jZSwgaXNLUGxhbmUsIGlzS1ZlcnRleCB9IGZyb20gXCIuL3V0aWxzXCI7XHJcbnZhciBTdGFnZTtcclxuKGZ1bmN0aW9uIChTdGFnZSkge1xyXG4gICAgU3RhZ2VbU3RhZ2VbXCJQaWNrVXBNb2RlbFwiXSA9IDBdID0gXCJQaWNrVXBNb2RlbFwiO1xyXG4gICAgU3RhZ2VbU3RhZ2VbXCJQaWNrVXBUYXJnZXRcIl0gPSAxXSA9IFwiUGlja1VwVGFyZ2V0XCI7XHJcbn0pKFN0YWdlIHx8IChTdGFnZSA9IHt9KSk7XHJcbmV4cG9ydCBjbGFzcyBBbGlnblRvb2wge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5zdGFnZSA9IFN0YWdlLlBpY2tVcE1vZGVsO1xyXG4gICAgfVxyXG4gICAgLy8gcHJpdmF0ZSBwYXRoUG9pbnRQb3NlczogUGF0aFBvaW50UG9zZVtdID0gW107XHJcbiAgICAvLyBwcml2YXRlIHRvdGFsTGVuZ3RoOiBudW1iZXIgPSAwO1xyXG4gICAgb25Ub29sQWN0aXZlKCkge1xyXG4gICAgICAgIC8vIGNvbnN0IHNlbGVjdGlvbiA9IGFwcC5nZXRTZWxlY3Rpb24oKTtcclxuICAgICAgICAvLyBjb25zdCB0b29sSGVscGVyID0gYXBwLmdldFRvb2xIZWxwZXIoKTtcclxuICAgICAgICAvLyB0b29sSGVscGVyLmVuYWJsZVBpY2tpbmcodHJ1ZSk7XHJcbiAgICAgICAgLy8gdG9vbEhlbHBlci5zZXREZWZhdWx0U2VsZWN0QmVoYXZpb3IoS1NlbGVjdEJlaGF2aW9yLkFERCk7XHJcbiAgICAgICAgLy8gY29uc3QgYWxsRW50aXRpZXMgPSBzZWxlY3Rpb24uZ2V0QWxsRW50aXRpZXMoKTtcclxuICAgICAgICAvLyBpZiAoYWxsRW50aXRpZXMubGVuZ3RoID09PSAxICYmIChpc0tHcm91cEluc3RhbmNlKGFsbEVudGl0aWVzWzBdKSB8fCBpc0tGYWNlKGFsbEVudGl0aWVzWzBdKSkpIHtcclxuICAgICAgICAvLyAgICAgdGhpcy5tb2RlbCA9IGFsbEVudGl0aWVzWzBdO1xyXG4gICAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gICAgIHNlbGVjdGlvbi5jbGVhcigpO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuICAgIG9uVG9vbERlYWN0aXZlKCkge1xyXG4gICAgICAgIGNvbnN0IHBsdWdpblVJID0gYXBwLmdldFBsdWdpblVJKCk7XHJcbiAgICAgICAgdGhpcy50cnlDb21taXQoKTtcclxuICAgICAgICBwbHVnaW5VSS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdsZWF2ZUFsaWduVG9vbCcgfSwgJyonKTtcclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgICAgLy8gY29uc3QgdG9vbEhlbHBlciA9IGFwcC5nZXRUb29sSGVscGVyKCk7XHJcbiAgICAgICAgLy8gdG9vbEhlbHBlci5lbmFibGVQaWNraW5nKGZhbHNlKTtcclxuICAgICAgICAvLyB0b29sSGVscGVyLnNldERlZmF1bHRTZWxlY3RCZWhhdmlvcihLU2VsZWN0QmVoYXZpb3IuUkVQTEFDRSk7XHJcbiAgICB9XHJcbiAgICBvbk1vdXNlTW92ZShldmVudCwgaW5mZXJlbmNlUmVzdWx0KSB7XHJcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2YsIF9nLCBfaCwgX2osIF9rLCBfbCwgX207XHJcbiAgICAgICAgY29uc3QgZW50aXR5ID0gaW5mZXJlbmNlUmVzdWx0ID09PSBudWxsIHx8IGluZmVyZW5jZVJlc3VsdCA9PT0gdm9pZCAwID8gdm9pZCAwIDogaW5mZXJlbmNlUmVzdWx0LmVudGl0eTtcclxuICAgICAgICBjb25zb2xlLmxvZyhlbnRpdHkpO1xyXG4gICAgICAgIGNvbnN0IGFwcFZpZXcgPSBhcHAuZ2V0QWN0aXZlVmlldygpO1xyXG4gICAgICAgIGNvbnN0IGN1ck1vZGVsID0gdGhpcy5zdGFnZSA9PT0gU3RhZ2UuUGlja1VwTW9kZWwgPyB0aGlzLm1vZGVsIDogdGhpcy50YXJnZXRNb2RlbDtcclxuICAgICAgICBpZiAoZW50aXR5KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IGluZmVyZW5jZVJlc3VsdC5pbnN0YW5jZVBhdGgucmVkdWNlKChhY2MsIGluc3RhbmNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhY2MubXVsdGlwbHkoaW5zdGFuY2UuZ2V0VHJhbnNmb3JtKCkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcclxuICAgICAgICAgICAgfSwgR2VvbUxpYi5jcmVhdGVJZGVudGl0eU1hdHJpeDQoKSk7XHJcbiAgICAgICAgICAgIGxldCBpbmZlcmVuY2VNb2RlbDtcclxuICAgICAgICAgICAgaWYgKGlzS0ZhY2UoZW50aXR5KSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3VyZmFjZSA9IGVudGl0eS5nZXRTdXJmYWNlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNLUGxhbmUoc3VyZmFjZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzS0ZhY2UoY3VyTW9kZWwgPT09IG51bGwgfHwgY3VyTW9kZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1ck1vZGVsLmluZmVyZW5jZUVudGl0eSkgfHwgKGN1ck1vZGVsID09PSBudWxsIHx8IGN1ck1vZGVsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJNb2RlbC5pbmZlcmVuY2VFbnRpdHkuZ2V0S2V5KCkpICE9PSBlbnRpdHkuZ2V0S2V5KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9ybWFsID0gaW5mZXJlbmNlUmVzdWx0Lm5vcm1hbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc3Qgbm9ybWFsID0gc3VyZmFjZS5ub3JtYWwuYXBwbGllZE1hdHJpeDQodHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmFjZVZlcnRleFBvaW50cyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnRpdHkuZ2V0VmVydGljZXMoKS5mb3JFYWNoKHZlcnRleCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludCA9IHZlcnRleC5nZXRQb2ludCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBvaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFjZVZlcnRleFBvaW50cy5wdXNoKHBvaW50LmFwcGxpZWRNYXRyaXg0KHRyYW5zZm9ybSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5mZXJlbmNlTW9kZWwgPSB7IHBvc2l0aW9uOiBpbmZlcmVuY2VSZXN1bHQucG9zaXRpb24sIGluZmVyZW5jZUVudGl0eTogZW50aXR5LCBub3JtYWwsIHBhdGg6IGluZmVyZW5jZVJlc3VsdC5pbnN0YW5jZVBhdGggfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ck1vZGVsID09PSBudWxsIHx8IGN1ck1vZGVsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJNb2RlbC50ZW1wU2hhcGVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwVmlldy5jbGVhclRlbXBvcmFyeVNoYXBlc0J5SWRzKFtjdXJNb2RlbC50ZW1wU2hhcGVJZF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmYWNlVmVydGV4UG9pbnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhY2VWZXJ0ZXhQb2ludHMucHVzaChmYWNlVmVydGV4UG9pbnRzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBTaGFwZUlkID0gKF9hID0gYXBwVmlldy5kcmF3RmxhdExpbmVzKFtmYWNlVmVydGV4UG9pbnRzXSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiB7IHI6IDI1NSwgZzogMCwgYjogMCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm46IEtMaW5lUGF0dGVybi5Tb2xpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuaWRzWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mZXJlbmNlTW9kZWwudGVtcFNoYXBlSWQgPSB0ZW1wU2hhcGVJZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGFnZSA9PT0gU3RhZ2UuUGlja1VwTW9kZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW9kZWwgPSBpbmZlcmVuY2VNb2RlbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0TW9kZWwgPSBpbmZlcmVuY2VNb2RlbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGN1ck1vZGVsLnBvc2l0aW9uID0gaW5mZXJlbmNlUmVzdWx0LnBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpc0tFZGdlKGVudGl0eSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHAwID0gKF9iID0gZW50aXR5LmdldFZlcnRleEEoKSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmdldFBvaW50KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwMSA9IChfYyA9IGVudGl0eS5nZXRWZXJ0ZXhCKCkpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5nZXRQb2ludCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHAwICYmIHAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0tFZGdlKGN1ck1vZGVsID09PSBudWxsIHx8IGN1ck1vZGVsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJNb2RlbC5pbmZlcmVuY2VFbnRpdHkpIHx8IChjdXJNb2RlbCA9PT0gbnVsbCB8fCBjdXJNb2RlbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VyTW9kZWwuaW5mZXJlbmNlRW50aXR5LmdldEtleSgpKSAhPT0gZW50aXR5LmdldEtleSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50cyA9IFtwMC5hcHBsaWVkTWF0cml4NCh0cmFuc2Zvcm0pLCBwMS5hcHBsaWVkTWF0cml4NCh0cmFuc2Zvcm0pXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gcG9pbnRzWzFdLnN1YnRyYWN0ZWQocG9pbnRzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5mZXJlbmNlTW9kZWwgPSB7IHBvc2l0aW9uOiBpbmZlcmVuY2VSZXN1bHQucG9zaXRpb24sIGluZmVyZW5jZUVudGl0eTogZW50aXR5LCBkaXJlY3Rpb24sIHBhdGg6IGluZmVyZW5jZVJlc3VsdC5pbnN0YW5jZVBhdGgsIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJNb2RlbCA9PT0gbnVsbCB8fCBjdXJNb2RlbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VyTW9kZWwudGVtcFNoYXBlSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcFZpZXcuY2xlYXJUZW1wb3JhcnlTaGFwZXNCeUlkcyhbY3VyTW9kZWwudGVtcFNoYXBlSWRdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW1wU2hhcGVJZCA9IChfZCA9IGFwcFZpZXcuZHJhd0ZsYXRMaW5lcyhbcG9pbnRzXSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHsgcjogMjU1LCBnOiAwLCBiOiAwIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuOiBLTGluZVBhdHRlcm4uU29saWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QuaWRzWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZlcmVuY2VNb2RlbC50ZW1wU2hhcGVJZCA9IHRlbXBTaGFwZUlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGFnZSA9PT0gU3RhZ2UuUGlja1VwTW9kZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubW9kZWwgPSBpbmZlcmVuY2VNb2RlbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFyZ2V0TW9kZWwgPSBpbmZlcmVuY2VNb2RlbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGN1ck1vZGVsLnBvc2l0aW9uID0gaW5mZXJlbmNlUmVzdWx0LnBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpc0tWZXJ0ZXgoZW50aXR5KSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcDAgPSBlbnRpdHkuZ2V0UG9pbnQoKTtcclxuICAgICAgICAgICAgICAgIGlmIChwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNLVmVydGV4KGN1ck1vZGVsID09PSBudWxsIHx8IGN1ck1vZGVsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJNb2RlbC5pbmZlcmVuY2VFbnRpdHkpIHx8ICEoKF9lID0gY3VyTW9kZWwgPT09IG51bGwgfHwgY3VyTW9kZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1ck1vZGVsLmluZmVyZW5jZUVudGl0eS5nZXRQb2ludCgpKSA9PT0gbnVsbCB8fCBfZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2UuaXNFcXVhbChwMCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZmVyZW5jZU1vZGVsID0geyBwb3NpdGlvbjogaW5mZXJlbmNlUmVzdWx0LnBvc2l0aW9uLCBpbmZlcmVuY2VFbnRpdHk6IGVudGl0eSwgcGF0aDogaW5mZXJlbmNlUmVzdWx0Lmluc3RhbmNlUGF0aCwgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ck1vZGVsID09PSBudWxsIHx8IGN1ck1vZGVsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJNb2RlbC50ZW1wU2hhcGVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwVmlldy5jbGVhclRlbXBvcmFyeVNoYXBlc0J5SWRzKFtjdXJNb2RlbC50ZW1wU2hhcGVJZF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBTaGFwZUlkID0gKF9mID0gYXBwVmlldy5kcmF3UG9pbnRzKFtwMC5hcHBsaWVkTWF0cml4NCh0cmFuc2Zvcm0pXSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHsgcjogMjU1LCBnOiAwLCBiOiAwIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKSA9PT0gbnVsbCB8fCBfZiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2YuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZmVyZW5jZU1vZGVsLnRlbXBTaGFwZUlkID0gdGVtcFNoYXBlSWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YWdlID09PSBTdGFnZS5QaWNrVXBNb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbCA9IGluZmVyZW5jZU1vZGVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXRNb2RlbCA9IGluZmVyZW5jZU1vZGVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY3VyTW9kZWwucG9zaXRpb24gPSBpbmZlcmVuY2VSZXN1bHQucG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGlzS0F1eGlsaWFyeUJvdW5kZWRDdXJ2ZShlbnRpdHkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib3VuZGVkQ3VydmUgPSBlbnRpdHkuZ2V0Qm91bmRlZEN1cnZlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNLQXJjM2QoYm91bmRlZEN1cnZlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnZlUG9pbnRzID0gYm91bmRlZEN1cnZlLmdldEFwcHJveGltYXRlUG9pbnRzQnlBbmdsZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJ2ZVBvaW50cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0tBdXhpbGlhcnlCb3VuZGVkQ3VydmUoY3VyTW9kZWwgPT09IG51bGwgfHwgY3VyTW9kZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1ck1vZGVsLmluZmVyZW5jZUVudGl0eSkgfHwgKGN1ck1vZGVsID09PSBudWxsIHx8IGN1ck1vZGVsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJNb2RlbC5pbmZlcmVuY2VFbnRpdHkuZ2V0S2V5KCkpICE9PSBlbnRpdHkuZ2V0S2V5KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50cyA9IGN1cnZlUG9pbnRzLm1hcChwID0+IHAuYXBwbGllZE1hdHJpeDQodHJhbnNmb3JtKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHMucHVzaChwb2ludHNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9ybWFsID0gYm91bmRlZEN1cnZlLm5vcm1hbC5hcHBsaWVkTWF0cml4NCh0cmFuc2Zvcm0pLm5vcm1hbGl6ZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZmVyZW5jZU1vZGVsID0geyBwb3NpdGlvbjogaW5mZXJlbmNlUmVzdWx0LnBvc2l0aW9uLCBpbmZlcmVuY2VFbnRpdHk6IGVudGl0eSwgbm9ybWFsLCBwYXRoOiBpbmZlcmVuY2VSZXN1bHQuaW5zdGFuY2VQYXRoLCB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ck1vZGVsID09PSBudWxsIHx8IGN1ck1vZGVsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJNb2RlbC50ZW1wU2hhcGVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcFZpZXcuY2xlYXJUZW1wb3JhcnlTaGFwZXNCeUlkcyhbY3VyTW9kZWwudGVtcFNoYXBlSWRdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBTaGFwZUlkID0gKF9nID0gYXBwVmlldy5kcmF3RmxhdExpbmVzKFtwb2ludHNdLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHsgcjogMjU1LCBnOiAwLCBiOiAwIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybjogS0xpbmVQYXR0ZXJuLlNvbGlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpID09PSBudWxsIHx8IF9nID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZy5pZHNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZlcmVuY2VNb2RlbC50ZW1wU2hhcGVJZCA9IHRlbXBTaGFwZUlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhZ2UgPT09IFN0YWdlLlBpY2tVcE1vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbCA9IGluZmVyZW5jZU1vZGVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXRNb2RlbCA9IGluZmVyZW5jZU1vZGVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1ck1vZGVsLnBvc2l0aW9uID0gaW5mZXJlbmNlUmVzdWx0LnBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcDAgPSAoX2ggPSBlbnRpdHkuZ2V0U3RhcnRWZXJ0ZXgoKSkgPT09IG51bGwgfHwgX2ggPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9oLmdldFBvaW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcDEgPSAoX2ogPSBlbnRpdHkuZ2V0RW5kVmVydGV4KCkpID09PSBudWxsIHx8IF9qID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfai5nZXRQb2ludCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwMCAmJiBwMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzS0F1eGlsaWFyeUJvdW5kZWRDdXJ2ZShjdXJNb2RlbCA9PT0gbnVsbCB8fCBjdXJNb2RlbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VyTW9kZWwuaW5mZXJlbmNlRW50aXR5KSB8fCAoY3VyTW9kZWwgPT09IG51bGwgfHwgY3VyTW9kZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1ck1vZGVsLmluZmVyZW5jZUVudGl0eS5nZXRLZXkoKSkgIT09IGVudGl0eS5nZXRLZXkoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9pbnRzID0gW3AwLmFwcGxpZWRNYXRyaXg0KHRyYW5zZm9ybSksIHAxLmFwcGxpZWRNYXRyaXg0KHRyYW5zZm9ybSldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gcG9pbnRzWzFdLnN1YnRyYWN0ZWQocG9pbnRzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZmVyZW5jZU1vZGVsID0geyBwb3NpdGlvbjogaW5mZXJlbmNlUmVzdWx0LnBvc2l0aW9uLCBpbmZlcmVuY2VFbnRpdHk6IGVudGl0eSwgZGlyZWN0aW9uLCBwYXRoOiBpbmZlcmVuY2VSZXN1bHQuaW5zdGFuY2VQYXRoLCB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ck1vZGVsID09PSBudWxsIHx8IGN1ck1vZGVsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJNb2RlbC50ZW1wU2hhcGVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcFZpZXcuY2xlYXJUZW1wb3JhcnlTaGFwZXNCeUlkcyhbY3VyTW9kZWwudGVtcFNoYXBlSWRdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBTaGFwZUlkID0gKF9rID0gYXBwVmlldy5kcmF3RmxhdExpbmVzKFtwb2ludHNdLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHsgcjogMjU1LCBnOiAwLCBiOiAwIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybjogS0xpbmVQYXR0ZXJuLlNvbGlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpID09PSBudWxsIHx8IF9rID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfay5pZHNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZlcmVuY2VNb2RlbC50ZW1wU2hhcGVJZCA9IHRlbXBTaGFwZUlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhZ2UgPT09IFN0YWdlLlBpY2tVcE1vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbCA9IGluZmVyZW5jZU1vZGVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXRNb2RlbCA9IGluZmVyZW5jZU1vZGVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1ck1vZGVsLnBvc2l0aW9uID0gaW5mZXJlbmNlUmVzdWx0LnBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGlzS0F1eGlsaWFyeUxpbmUoZW50aXR5KSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGluZSA9IGVudGl0eS5nZXRMaW5lKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzS0F1eGlsaWFyeUxpbmUoY3VyTW9kZWwgPT09IG51bGwgfHwgY3VyTW9kZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1ck1vZGVsLmluZmVyZW5jZUVudGl0eSkgfHwgKGN1ck1vZGVsID09PSBudWxsIHx8IGN1ck1vZGVsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJNb2RlbC5pbmZlcmVuY2VFbnRpdHkuZ2V0S2V5KCkpICE9PSBlbnRpdHkuZ2V0S2V5KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGRpcmVjdGlvbjogbGluZURpcmVjdGlvbiwgb3JpZ2luIH0gPSBsaW5lO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50cyA9IFtvcmlnaW4uYWRkZWQobGluZURpcmVjdGlvbi5tdWx0aXBsaWVkKDEwMDAwMCkpLmFwcGxpZWRNYXRyaXg0KHRyYW5zZm9ybSksIG9yaWdpbi5hZGRlZChsaW5lRGlyZWN0aW9uLm11bHRpcGxpZWQoLTEwMDAwMCkpLmFwcGxpZWRNYXRyaXg0KHRyYW5zZm9ybSldO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHBvaW50c1sxXS5zdWJ0cmFjdGVkKHBvaW50c1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5mZXJlbmNlTW9kZWwgPSB7IHBvc2l0aW9uOiBpbmZlcmVuY2VSZXN1bHQucG9zaXRpb24sIGluZmVyZW5jZUVudGl0eTogZW50aXR5LCBkaXJlY3Rpb24sIHBhdGg6IGluZmVyZW5jZVJlc3VsdC5pbnN0YW5jZVBhdGgsIH07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1ck1vZGVsID09PSBudWxsIHx8IGN1ck1vZGVsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJNb2RlbC50ZW1wU2hhcGVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBWaWV3LmNsZWFyVGVtcG9yYXJ5U2hhcGVzQnlJZHMoW2N1ck1vZGVsLnRlbXBTaGFwZUlkXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBTaGFwZUlkID0gKF9sID0gYXBwVmlldy5kcmF3RmxhdExpbmVzKFtwb2ludHNdLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiB7IHI6IDI1NSwgZzogMCwgYjogMCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXR0ZXJuOiBLTGluZVBhdHRlcm4uU29saWQsXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpID09PSBudWxsIHx8IF9sID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfbC5pZHNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgaW5mZXJlbmNlTW9kZWwudGVtcFNoYXBlSWQgPSB0ZW1wU2hhcGVJZDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGFnZSA9PT0gU3RhZ2UuUGlja1VwTW9kZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbCA9IGluZmVyZW5jZU1vZGVsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXRNb2RlbCA9IGluZmVyZW5jZU1vZGVsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjdXJNb2RlbC5wb3NpdGlvbiA9IGluZmVyZW5jZVJlc3VsdC5wb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpc0tBcmNoRmFjZShlbnRpdHkpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGFnZSA9PT0gU3RhZ2UuUGlja1VwVGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3VyZmFjZSA9IGVudGl0eS5nZXRTdXJmYWNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzS1BsYW5lKHN1cmZhY2UpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbnRvdXIgPSBlbnRpdHkuZ2V0RmFjZTNkKCkuY29udG91cjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm9ybWFsID0gaW5mZXJlbmNlUmVzdWx0Lm5vcm1hbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc3Qgbm9ybWFsID0gc3VyZmFjZS5ub3JtYWwuYXBwbGllZE1hdHJpeDQodHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY29udG91clBvaW50cyA9IGNvbnRvdXIubWFwKHNlZ21lbnQgPT4gc2VnbWVudC5zdGFydFBvaW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5mZXJlbmNlTW9kZWwgPSB7IHBvc2l0aW9uOiBpbmZlcmVuY2VSZXN1bHQucG9zaXRpb24sIGluZmVyZW5jZUVudGl0eTogZW50aXR5LCBub3JtYWwsIHBhdGg6IGluZmVyZW5jZVJlc3VsdC5pbnN0YW5jZVBhdGggfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ck1vZGVsID09PSBudWxsIHx8IGN1ck1vZGVsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJNb2RlbC50ZW1wU2hhcGVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBwVmlldy5jbGVhclRlbXBvcmFyeVNoYXBlc0J5SWRzKFtjdXJNb2RlbC50ZW1wU2hhcGVJZF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250b3VyUG9pbnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRvdXJQb2ludHMucHVzaChjb250b3VyUG9pbnRzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBTaGFwZUlkID0gKF9tID0gYXBwVmlldy5kcmF3RmxhdExpbmVzKFtjb250b3VyUG9pbnRzXSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiB7IHI6IDI1NSwgZzogMCwgYjogMCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm46IEtMaW5lUGF0dGVybi5Tb2xpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKSA9PT0gbnVsbCB8fCBfbSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX20uaWRzWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mZXJlbmNlTW9kZWwudGVtcFNoYXBlSWQgPSB0ZW1wU2hhcGVJZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhcmdldE1vZGVsID0gaW5mZXJlbmNlTW9kZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaXNLR3JvdXBJbnN0YW5jZShlbnRpdHkpKSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGN1ck1vZGVsID09PSBudWxsIHx8IGN1ck1vZGVsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJNb2RlbC50ZW1wU2hhcGVJZCkge1xyXG4gICAgICAgICAgICBhcHBWaWV3LmNsZWFyVGVtcG9yYXJ5U2hhcGVzQnlJZHMoW2N1ck1vZGVsLnRlbXBTaGFwZUlkXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnN0YWdlID09PSBTdGFnZS5QaWNrVXBNb2RlbCkge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGVsID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRNb2RlbCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBvbkxCdXR0b25VcChldmVudCwgaW5mZXJlbmNlUmVzdWx0KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhZ2UgPT09IFN0YWdlLlBpY2tVcE1vZGVsKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YWdlID0gU3RhZ2UuUGlja1VwVGFyZ2V0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50YXJnZXRNb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgYXBwLmRlYWN0aXZhdGVDdXN0b21Ub29sKHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdHJ5Q29tbWl0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLm1vZGVsICYmIHRoaXMudGFyZ2V0TW9kZWwpIHtcclxuICAgICAgICAgICAgY29uc3QgZGVzaWduID0gYXBwLmdldEFjdGl2ZURlc2lnbigpO1xyXG4gICAgICAgICAgICBjb25zdCBlZGl0UGF0aCA9IGRlc2lnbi5nZXRFZGl0UGF0aCgpO1xyXG4gICAgICAgICAgICBjb25zdCBlZGl0VHJhbnNmb3JtID0gZWRpdFBhdGgucmVkdWNlKChhY2MsIGluc3RhbmNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhY2MubXVsdGlwbHkoaW5zdGFuY2UuZ2V0VHJhbnNmb3JtKCkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjYztcclxuICAgICAgICAgICAgfSwgR2VvbUxpYi5jcmVhdGVJZGVudGl0eU1hdHJpeDQoKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgcG9zaXRpb246IG1vZGVsUG9zaXRpb24sIGluZmVyZW5jZUVudGl0eTogbW9kZWxFbnRpdHksIG5vcm1hbDogbW9kZWxOb3JtYWwsIGRpcmVjdGlvbjogbW9kZWxEaXJlY3Rpb24sIHBhdGg6IG1vZGVsUGF0aCB9ID0gdGhpcy5tb2RlbDtcclxuICAgICAgICAgICAgY29uc3QgeyBwb3NpdGlvbjogdGFyZ2V0UG9zaXRpb24sIG5vcm1hbDogdGFyZ2V0Tm9ybWFsLCBkaXJlY3Rpb246IHRhcmdldERpcmVjdGlvbiB9ID0gdGhpcy50YXJnZXRNb2RlbDtcclxuICAgICAgICAgICAgY29uc3QgbWF0ID0gZWRpdFRyYW5zZm9ybS5pbnZlcnNlZCgpLm11bHRpcGxpZWQoR2VvbUxpYi5jcmVhdGVUcmFuc2xhdGlvbk1hdHJpeDQodGFyZ2V0UG9zaXRpb24ueCAtIG1vZGVsUG9zaXRpb24ueCwgdGFyZ2V0UG9zaXRpb24ueSAtIG1vZGVsUG9zaXRpb24ueSwgdGFyZ2V0UG9zaXRpb24ueiAtIG1vZGVsUG9zaXRpb24ueikpO1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXROb3JtYWxSZXZlcnNlID0gdGFyZ2V0Tm9ybWFsID09PSBudWxsIHx8IHRhcmdldE5vcm1hbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogdGFyZ2V0Tm9ybWFsLnJldmVyc2VkKCk7XHJcbiAgICAgICAgICAgIGlmICh0YXJnZXROb3JtYWxSZXZlcnNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobW9kZWxOb3JtYWwgJiYgIW1vZGVsTm9ybWFsLmlzUGFyYWxsZWwodGFyZ2V0Tm9ybWFsUmV2ZXJzZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjcm9zc1ZlYyA9IG1vZGVsTm9ybWFsLmNyb3NzKHRhcmdldE5vcm1hbFJldmVyc2UpLm5vcm1hbGl6ZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdlbCA9IG1vZGVsTm9ybWFsLmFuZ2xlVG8odGFyZ2V0Tm9ybWFsUmV2ZXJzZSwgY3Jvc3NWZWMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvdGF0ZU1hdHJpeCA9IEdlb21MaWIuY3JlYXRlUm90YXRlTWF0cml4NChhbmdlbCwgY3Jvc3NWZWMsIHRoaXMubW9kZWwucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdC5tdWx0aXBseShyb3RhdGVNYXRyaXgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobW9kZWxEaXJlY3Rpb24gJiYgIW1vZGVsRGlyZWN0aW9uLmlzUGVycGVuZGljdWxhcih0YXJnZXROb3JtYWxSZXZlcnNlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNyb3NzVmVjMSA9IG1vZGVsRGlyZWN0aW9uLmNyb3NzKHRhcmdldE5vcm1hbFJldmVyc2UpLm5vcm1hbGl6ZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdlbDEgPSBtb2RlbERpcmVjdGlvbi5hbmdsZVRvKHRhcmdldE5vcm1hbFJldmVyc2UsIGNyb3NzVmVjMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm90YXRlTWF0cml4MSA9IEdlb21MaWIuY3JlYXRlUm90YXRlTWF0cml4NChhbmdlbDEgLSBNYXRoLlBJIC8gMiAqIChhbmdlbDEgPiBNYXRoLlBJID8gMyA6IDEpLCBjcm9zc1ZlYzEsIHRoaXMubW9kZWwucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdC5tdWx0aXBseShyb3RhdGVNYXRyaXgxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0YXJnZXREaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIGlmIChtb2RlbE5vcm1hbCAmJiAhbW9kZWxOb3JtYWwuaXNQZXJwZW5kaWN1bGFyKHRhcmdldERpcmVjdGlvbikpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjcm9zc1ZlYzIgPSBtb2RlbE5vcm1hbC5jcm9zcyh0YXJnZXREaXJlY3Rpb24pLm5vcm1hbGl6ZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdlbDIgPSBtb2RlbE5vcm1hbC5hbmdsZVRvKHRhcmdldERpcmVjdGlvbiwgY3Jvc3NWZWMyKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByb3RhdGVNYXRyaXgxID0gR2VvbUxpYi5jcmVhdGVSb3RhdGVNYXRyaXg0KGFuZ2VsMiAtIE1hdGguUEkgLyAyICogKGFuZ2VsMiA+IE1hdGguUEkgPyAzIDogMSksIGNyb3NzVmVjMiwgdGhpcy5tb2RlbC5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Lm11bHRpcGx5KHJvdGF0ZU1hdHJpeDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobW9kZWxEaXJlY3Rpb24gJiYgIW1vZGVsRGlyZWN0aW9uLmlzUGFyYWxsZWwodGFyZ2V0RGlyZWN0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNyb3NzVmVjMyA9IG1vZGVsRGlyZWN0aW9uLmNyb3NzKHRhcmdldERpcmVjdGlvbikubm9ybWFsaXplZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFuZ2VsMyA9IG1vZGVsRGlyZWN0aW9uLmFuZ2xlVG8odGFyZ2V0RGlyZWN0aW9uLCBjcm9zc1ZlYzMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvdGF0ZU1hdHJpeDEgPSBHZW9tTGliLmNyZWF0ZVJvdGF0ZU1hdHJpeDQoYW5nZWwzIC0gTWF0aC5QSSAvIDIgKiAoYW5nZWwzID4gTWF0aC5QSSA/IDMgOiAxKSwgY3Jvc3NWZWMzLCB0aGlzLm1vZGVsLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICBtYXQubXVsdGlwbHkocm90YXRlTWF0cml4MSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWF0Lm11bHRpcGx5KGVkaXRUcmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRUb1RyYW5zZm9ybSA9IG1vZGVsUGF0aC5maW5kKGluc3RhbmNlID0+ICFlZGl0UGF0aC5zb21lKGlucyA9PiBpbnMuZ2V0S2V5KCkgPT09IGluc3RhbmNlLmdldEtleSgpKSkgfHwgbW9kZWxFbnRpdHk7XHJcbiAgICAgICAgICAgIGxldCB0cmFuc2Zvcm1TdWNjZXNzID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmIChpc0tGYWNlKHRhcmdldFRvVHJhbnNmb3JtKSB8fCBpc0tFZGdlKHRhcmdldFRvVHJhbnNmb3JtKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hlbGwgPSB0YXJnZXRUb1RyYW5zZm9ybS5nZXRTaGVsbCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNoZWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtU3VjY2VzcyA9IGRlc2lnbi50cmFuc2Zvcm1TaGVsbHMoW3NoZWxsXSwgbWF0KS5pc1N1Y2Nlc3M7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaXNLVmVydGV4KHRhcmdldFRvVHJhbnNmb3JtKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hlbGwgPSB0YXJnZXRUb1RyYW5zZm9ybS5nZXRFZGdlcygpWzBdLmdldFNoZWxsKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2hlbGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1TdWNjZXNzID0gZGVzaWduLnRyYW5zZm9ybVNoZWxscyhbc2hlbGxdLCBtYXQpLmlzU3VjY2VzcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpc0tBdXhpbGlhcnlCb3VuZGVkQ3VydmUodGFyZ2V0VG9UcmFuc2Zvcm0pIHx8IGlzS0F1eGlsaWFyeUxpbmUodGFyZ2V0VG9UcmFuc2Zvcm0pKSB7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1TdWNjZXNzID0gZGVzaWduLnRyYW5zZm9ybUF1eGlsaWFyeUN1cnZlcyhbdGFyZ2V0VG9UcmFuc2Zvcm1dLCBtYXQpLmlzU3VjY2VzcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpc0tHcm91cEluc3RhbmNlKHRhcmdldFRvVHJhbnNmb3JtKSkge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtU3VjY2VzcyA9IGRlc2lnbi50cmFuc2Zvcm1Hcm91cEluc3RhbmNlcyhbdGFyZ2V0VG9UcmFuc2Zvcm1dLCBtYXQpLmlzU3VjY2VzcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodHJhbnNmb3JtU3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gYXBwLmdldFNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgc2VsZWN0aW9uLmFkZChbdGFyZ2V0VG9UcmFuc2Zvcm1dKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjb25zdCBwaWNrSGVscGVyID0gYXBwLmdldFBpY2tIZWxwZXIoKTtcclxuICAgICAgICAgICAgLy8gLy8gY29uc3QgcGlja2FibGVFbnRpdHlUeXBlID0gdGhpcy5tb2RlbCA/IFtLRW50aXR5VHlwZS5BdXhpbGlhcnlCb3VuZGVkQ3VydmVdIDogW0tBcHBFbnRpdHlUeXBlLkdyb3VwSW5zdGFuY2UsIEtFbnRpdHlUeXBlLkZhY2VdO1xyXG4gICAgICAgICAgICAvLyBjb25zdCBhbGxQaWNrZWRFbnRpdGllcyA9IHBpY2tIZWxwZXIucGlja0J5UG9pbnQoZXZlbnQuY2xpZW50WCgpLCBldmVudC5jbGllbnRZKCkpLmdldEFsbFBpY2tlZCgpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhhbGxQaWNrZWRFbnRpdGllcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2xlYXIoKSB7XHJcbiAgICAgICAgY29uc3QgYXBwVmlldyA9IGFwcC5nZXRBY3RpdmVWaWV3KCk7XHJcbiAgICAgICAgYXBwVmlldy5jbGVhclRlbXBvcmFyeVNoYXBlcygpO1xyXG4gICAgICAgIHRoaXMubW9kZWwgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy50YXJnZXRNb2RlbCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLnN0YWdlID0gU3RhZ2UuUGlja1VwTW9kZWw7XHJcbiAgICB9XHJcbiAgICBvblJCdXR0b25VcChldmVudCwgaW5mZXJlbmNlUmVzdWx0KSB7XHJcbiAgICAgICAgYXBwLmRlYWN0aXZhdGVDdXN0b21Ub29sKHRoaXMpO1xyXG4gICAgfVxyXG4gICAgb25MQnV0dG9uRGJDbGljayhldmVudCwgaW5mZXJlbmNlUmVzdWx0KSB7XHJcbiAgICAgICAgO1xyXG4gICAgfVxyXG4gICAgYWxsb3dVc2luZ0luZmVyZW5jZSgpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIG9uS2V5RG93bihldmVudCkge1xyXG4gICAgICAgIDtcclxuICAgIH1cclxuICAgIG9uS2V5VXAoZXZlbnQpIHtcclxuICAgICAgICA7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNvbnN0IGFsaWduVG9vbCA9IG5ldyBBbGlnblRvb2woKTtcclxuIiwiaW1wb3J0IHsgaXNLQXJjM2QsIGlzS0F1eGlsaWFyeUJvdW5kZWRDdXJ2ZSwgaXNLQXV4aWxpYXJ5TGluZSwgaXNLRWRnZSwgaXNLRmFjZSwgaXNLR3JvdXBJbnN0YW5jZSwgaXNLUGxhbmUsIGlzS1ZlcnRleCB9IGZyb20gXCIuL3V0aWxzXCI7XHJcbnZhciBTdGFnZTtcclxuKGZ1bmN0aW9uIChTdGFnZSkge1xyXG4gICAgU3RhZ2VbU3RhZ2VbXCJQaWNrVXBNb2RlbFwiXSA9IDBdID0gXCJQaWNrVXBNb2RlbFwiO1xyXG4gICAgU3RhZ2VbU3RhZ2VbXCJQaWNrVXBUYXJnZXRcIl0gPSAxXSA9IFwiUGlja1VwVGFyZ2V0XCI7XHJcbn0pKFN0YWdlIHx8IChTdGFnZSA9IHt9KSk7XHJcbmV4cG9ydCBjbGFzcyBQYXRjaE1ha2VHcm91cFRvb2wge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5zdGFnZSA9IFN0YWdlLlBpY2tVcE1vZGVsO1xyXG4gICAgfVxyXG4gICAgLy8gcHJpdmF0ZSBwYXRoUG9pbnRQb3NlczogUGF0aFBvaW50UG9zZVtdID0gW107XHJcbiAgICAvLyBwcml2YXRlIHRvdGFsTGVuZ3RoOiBudW1iZXIgPSAwO1xyXG4gICAgb25Ub29sQWN0aXZlKCkge1xyXG4gICAgICAgIC8vIGNvbnN0IHNlbGVjdGlvbiA9IGFwcC5nZXRTZWxlY3Rpb24oKTtcclxuICAgICAgICAvLyBjb25zdCB0b29sSGVscGVyID0gYXBwLmdldFRvb2xIZWxwZXIoKTtcclxuICAgICAgICAvLyB0b29sSGVscGVyLmVuYWJsZVBpY2tpbmcodHJ1ZSk7XHJcbiAgICAgICAgLy8gdG9vbEhlbHBlci5zZXREZWZhdWx0U2VsZWN0QmVoYXZpb3IoS1NlbGVjdEJlaGF2aW9yLkFERCk7XHJcbiAgICAgICAgLy8gY29uc3QgYWxsRW50aXRpZXMgPSBzZWxlY3Rpb24uZ2V0QWxsRW50aXRpZXMoKTtcclxuICAgICAgICAvLyBpZiAoYWxsRW50aXRpZXMubGVuZ3RoID09PSAxICYmIChpc0tHcm91cEluc3RhbmNlKGFsbEVudGl0aWVzWzBdKSB8fCBpc0tGYWNlKGFsbEVudGl0aWVzWzBdKSkpIHtcclxuICAgICAgICAvLyAgICAgdGhpcy5tb2RlbCA9IGFsbEVudGl0aWVzWzBdO1xyXG4gICAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gICAgIHNlbGVjdGlvbi5jbGVhcigpO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuICAgIG9uVG9vbERlYWN0aXZlKCkge1xyXG4gICAgICAgIGNvbnN0IHBsdWdpblVJID0gYXBwLmdldFBsdWdpblVJKCk7XHJcbiAgICAgICAgdGhpcy50cnlDb21taXQoKTtcclxuICAgICAgICBwbHVnaW5VSS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdsZWF2ZUFsaWduVG9vbCcgfSwgJyonKTtcclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgICAgLy8gY29uc3QgdG9vbEhlbHBlciA9IGFwcC5nZXRUb29sSGVscGVyKCk7XHJcbiAgICAgICAgLy8gdG9vbEhlbHBlci5lbmFibGVQaWNraW5nKGZhbHNlKTtcclxuICAgICAgICAvLyB0b29sSGVscGVyLnNldERlZmF1bHRTZWxlY3RCZWhhdmlvcihLU2VsZWN0QmVoYXZpb3IuUkVQTEFDRSk7XHJcbiAgICB9XHJcbiAgICBvbk1vdXNlTW92ZShldmVudCwgaW5mZXJlbmNlUmVzdWx0KSB7XHJcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kLCBfZSwgX2YsIF9nLCBfaCwgX2osIF9rLCBfbDtcclxuICAgICAgICBjb25zdCBlbnRpdHkgPSBpbmZlcmVuY2VSZXN1bHQgPT09IG51bGwgfHwgaW5mZXJlbmNlUmVzdWx0ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBpbmZlcmVuY2VSZXN1bHQuZW50aXR5O1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVudGl0eSk7XHJcbiAgICAgICAgY29uc3QgYXBwVmlldyA9IGFwcC5nZXRBY3RpdmVWaWV3KCk7XHJcbiAgICAgICAgY29uc3QgY3VyTW9kZWwgPSB0aGlzLnN0YWdlID09PSBTdGFnZS5QaWNrVXBNb2RlbCA/IHRoaXMubW9kZWwgOiB0aGlzLnRhcmdldE1vZGVsO1xyXG4gICAgICAgIGlmIChlbnRpdHkpIHtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gaW5mZXJlbmNlUmVzdWx0Lmluc3RhbmNlUGF0aC5yZWR1Y2UoKGFjYywgaW5zdGFuY2UpID0+IHtcclxuICAgICAgICAgICAgICAgIGFjYy5tdWx0aXBseShpbnN0YW5jZS5nZXRUcmFuc2Zvcm0oKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xyXG4gICAgICAgICAgICB9LCBHZW9tTGliLmNyZWF0ZUlkZW50aXR5TWF0cml4NCgpKTtcclxuICAgICAgICAgICAgbGV0IGluZmVyZW5jZU1vZGVsO1xyXG4gICAgICAgICAgICBpZiAoaXNLRmFjZShlbnRpdHkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdXJmYWNlID0gZW50aXR5LmdldFN1cmZhY2UoKTtcclxuICAgICAgICAgICAgICAgIGlmIChpc0tQbGFuZShzdXJmYWNlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNLRmFjZShjdXJNb2RlbCA9PT0gbnVsbCB8fCBjdXJNb2RlbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VyTW9kZWwuaW5mZXJlbmNlRW50aXR5KSB8fCAoY3VyTW9kZWwgPT09IG51bGwgfHwgY3VyTW9kZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1ck1vZGVsLmluZmVyZW5jZUVudGl0eS5nZXRLZXkoKSkgIT09IGVudGl0eS5nZXRLZXkoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBub3JtYWwgPSBpbmZlcmVuY2VSZXN1bHQubm9ybWFsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zdCBub3JtYWwgPSBzdXJmYWNlLm5vcm1hbC5hcHBsaWVkTWF0cml4NCh0cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmYWNlVmVydGV4UG9pbnRzID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudGl0eS5nZXRWZXJ0aWNlcygpLmZvckVhY2godmVydGV4ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvaW50ID0gdmVydGV4LmdldFBvaW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocG9pbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWNlVmVydGV4UG9pbnRzLnB1c2gocG9pbnQuYXBwbGllZE1hdHJpeDQodHJhbnNmb3JtKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZlcmVuY2VNb2RlbCA9IHsgcG9zaXRpb246IGluZmVyZW5jZVJlc3VsdC5wb3NpdGlvbiwgaW5mZXJlbmNlRW50aXR5OiBlbnRpdHksIG5vcm1hbCwgcGF0aDogaW5mZXJlbmNlUmVzdWx0Lmluc3RhbmNlUGF0aCB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyTW9kZWwgPT09IG51bGwgfHwgY3VyTW9kZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1ck1vZGVsLnRlbXBTaGFwZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBWaWV3LmNsZWFyVGVtcG9yYXJ5U2hhcGVzQnlJZHMoW2N1ck1vZGVsLnRlbXBTaGFwZUlkXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZhY2VWZXJ0ZXhQb2ludHMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFjZVZlcnRleFBvaW50cy5wdXNoKGZhY2VWZXJ0ZXhQb2ludHNbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVtcFNoYXBlSWQgPSAoX2EgPSBhcHBWaWV3LmRyYXdGbGF0TGluZXMoW2ZhY2VWZXJ0ZXhQb2ludHNdLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHsgcjogMjU1LCBnOiAwLCBiOiAwIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybjogS0xpbmVQYXR0ZXJuLlNvbGlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhcFNpemU6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmlkc1swXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZmVyZW5jZU1vZGVsLnRlbXBTaGFwZUlkID0gdGVtcFNoYXBlSWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhZ2UgPT09IFN0YWdlLlBpY2tVcE1vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGVsID0gaW5mZXJlbmNlTW9kZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhcmdldE1vZGVsID0gaW5mZXJlbmNlTW9kZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjdXJNb2RlbC5wb3NpdGlvbiA9IGluZmVyZW5jZVJlc3VsdC5wb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaXNLRWRnZShlbnRpdHkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwMCA9IChfYiA9IGVudGl0eS5nZXRWZXJ0ZXhBKCkpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5nZXRQb2ludCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcDEgPSAoX2MgPSBlbnRpdHkuZ2V0VmVydGV4QigpKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MuZ2V0UG9pbnQoKTtcclxuICAgICAgICAgICAgICAgIGlmIChwMCAmJiBwMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNLRWRnZShjdXJNb2RlbCA9PT0gbnVsbCB8fCBjdXJNb2RlbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VyTW9kZWwuaW5mZXJlbmNlRW50aXR5KSB8fCAoY3VyTW9kZWwgPT09IG51bGwgfHwgY3VyTW9kZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1ck1vZGVsLmluZmVyZW5jZUVudGl0eS5nZXRLZXkoKSkgIT09IGVudGl0eS5nZXRLZXkoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludHMgPSBbcDAuYXBwbGllZE1hdHJpeDQodHJhbnNmb3JtKSwgcDEuYXBwbGllZE1hdHJpeDQodHJhbnNmb3JtKV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHBvaW50c1sxXS5zdWJ0cmFjdGVkKHBvaW50c1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZmVyZW5jZU1vZGVsID0geyBwb3NpdGlvbjogaW5mZXJlbmNlUmVzdWx0LnBvc2l0aW9uLCBpbmZlcmVuY2VFbnRpdHk6IGVudGl0eSwgZGlyZWN0aW9uLCBwYXRoOiBpbmZlcmVuY2VSZXN1bHQuaW5zdGFuY2VQYXRoLCB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyTW9kZWwgPT09IG51bGwgfHwgY3VyTW9kZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1ck1vZGVsLnRlbXBTaGFwZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBWaWV3LmNsZWFyVGVtcG9yYXJ5U2hhcGVzQnlJZHMoW2N1ck1vZGVsLnRlbXBTaGFwZUlkXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVtcFNoYXBlSWQgPSAoX2QgPSBhcHBWaWV3LmRyYXdGbGF0TGluZXMoW3BvaW50c10sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiB7IHI6IDI1NSwgZzogMCwgYjogMCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybjogS0xpbmVQYXR0ZXJuLlNvbGlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FwU2l6ZTogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC5pZHNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZmVyZW5jZU1vZGVsLnRlbXBTaGFwZUlkID0gdGVtcFNoYXBlSWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YWdlID09PSBTdGFnZS5QaWNrVXBNb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbCA9IGluZmVyZW5jZU1vZGVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXRNb2RlbCA9IGluZmVyZW5jZU1vZGVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY3VyTW9kZWwucG9zaXRpb24gPSBpbmZlcmVuY2VSZXN1bHQucG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGlzS1ZlcnRleChlbnRpdHkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwMCA9IGVudGl0eS5nZXRQb2ludCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0tWZXJ0ZXgoY3VyTW9kZWwgPT09IG51bGwgfHwgY3VyTW9kZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1ck1vZGVsLmluZmVyZW5jZUVudGl0eSkgfHwgISgoX2UgPSBjdXJNb2RlbCA9PT0gbnVsbCB8fCBjdXJNb2RlbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VyTW9kZWwuaW5mZXJlbmNlRW50aXR5LmdldFBvaW50KCkpID09PSBudWxsIHx8IF9lID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZS5pc0VxdWFsKHAwKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5mZXJlbmNlTW9kZWwgPSB7IHBvc2l0aW9uOiBpbmZlcmVuY2VSZXN1bHQucG9zaXRpb24sIGluZmVyZW5jZUVudGl0eTogZW50aXR5LCBwYXRoOiBpbmZlcmVuY2VSZXN1bHQuaW5zdGFuY2VQYXRoLCB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyTW9kZWwgPT09IG51bGwgfHwgY3VyTW9kZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1ck1vZGVsLnRlbXBTaGFwZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBWaWV3LmNsZWFyVGVtcG9yYXJ5U2hhcGVzQnlJZHMoW2N1ck1vZGVsLnRlbXBTaGFwZUlkXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVtcFNoYXBlSWQgPSAoX2YgPSBhcHBWaWV3LmRyYXdQb2ludHMoW3AwLmFwcGxpZWRNYXRyaXg0KHRyYW5zZm9ybSldLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogeyByOiAyNTUsIGc6IDAsIGI6IDAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpID09PSBudWxsIHx8IF9mID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZi5pZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5mZXJlbmNlTW9kZWwudGVtcFNoYXBlSWQgPSB0ZW1wU2hhcGVJZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhZ2UgPT09IFN0YWdlLlBpY2tVcE1vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGVsID0gaW5mZXJlbmNlTW9kZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhcmdldE1vZGVsID0gaW5mZXJlbmNlTW9kZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjdXJNb2RlbC5wb3NpdGlvbiA9IGluZmVyZW5jZVJlc3VsdC5wb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaXNLQXV4aWxpYXJ5Qm91bmRlZEN1cnZlKGVudGl0eSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJvdW5kZWRDdXJ2ZSA9IGVudGl0eS5nZXRCb3VuZGVkQ3VydmUoKTtcclxuICAgICAgICAgICAgICAgIGlmIChpc0tBcmMzZChib3VuZGVkQ3VydmUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VydmVQb2ludHMgPSBib3VuZGVkQ3VydmUuZ2V0QXBwcm94aW1hdGVQb2ludHNCeUFuZ2xlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnZlUG9pbnRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzS0F1eGlsaWFyeUJvdW5kZWRDdXJ2ZShjdXJNb2RlbCA9PT0gbnVsbCB8fCBjdXJNb2RlbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VyTW9kZWwuaW5mZXJlbmNlRW50aXR5KSB8fCAoY3VyTW9kZWwgPT09IG51bGwgfHwgY3VyTW9kZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1ck1vZGVsLmluZmVyZW5jZUVudGl0eS5nZXRLZXkoKSkgIT09IGVudGl0eS5nZXRLZXkoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9pbnRzID0gY3VydmVQb2ludHMubWFwKHAgPT4gcC5hcHBsaWVkTWF0cml4NCh0cmFuc2Zvcm0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vcm1hbCA9IGJvdW5kZWRDdXJ2ZS5ub3JtYWwuYXBwbGllZE1hdHJpeDQodHJhbnNmb3JtKS5ub3JtYWxpemVkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZlcmVuY2VNb2RlbCA9IHsgcG9zaXRpb246IGluZmVyZW5jZVJlc3VsdC5wb3NpdGlvbiwgaW5mZXJlbmNlRW50aXR5OiBlbnRpdHksIG5vcm1hbCwgcGF0aDogaW5mZXJlbmNlUmVzdWx0Lmluc3RhbmNlUGF0aCwgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJNb2RlbCA9PT0gbnVsbCB8fCBjdXJNb2RlbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VyTW9kZWwudGVtcFNoYXBlSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBWaWV3LmNsZWFyVGVtcG9yYXJ5U2hhcGVzQnlJZHMoW2N1ck1vZGVsLnRlbXBTaGFwZUlkXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZW1wU2hhcGVJZCA9IChfZyA9IGFwcFZpZXcuZHJhd0ZsYXRMaW5lcyhbcG9pbnRzXSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiB7IHI6IDI1NSwgZzogMCwgYjogMCB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm46IEtMaW5lUGF0dGVybi5Tb2xpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYXBTaXplOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpID09PSBudWxsIHx8IF9nID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZy5pZHNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZlcmVuY2VNb2RlbC50ZW1wU2hhcGVJZCA9IHRlbXBTaGFwZUlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhZ2UgPT09IFN0YWdlLlBpY2tVcE1vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2RlbCA9IGluZmVyZW5jZU1vZGVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXRNb2RlbCA9IGluZmVyZW5jZU1vZGVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1ck1vZGVsLnBvc2l0aW9uID0gaW5mZXJlbmNlUmVzdWx0LnBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcDAgPSAoX2ggPSBlbnRpdHkuZ2V0U3RhcnRWZXJ0ZXgoKSkgPT09IG51bGwgfHwgX2ggPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9oLmdldFBvaW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcDEgPSAoX2ogPSBlbnRpdHkuZ2V0RW5kVmVydGV4KCkpID09PSBudWxsIHx8IF9qID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfai5nZXRQb2ludCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwMCAmJiBwMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzS0F1eGlsaWFyeUJvdW5kZWRDdXJ2ZShjdXJNb2RlbCA9PT0gbnVsbCB8fCBjdXJNb2RlbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VyTW9kZWwuaW5mZXJlbmNlRW50aXR5KSB8fCAoY3VyTW9kZWwgPT09IG51bGwgfHwgY3VyTW9kZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1ck1vZGVsLmluZmVyZW5jZUVudGl0eS5nZXRLZXkoKSkgIT09IGVudGl0eS5nZXRLZXkoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9pbnRzID0gW3AwLmFwcGxpZWRNYXRyaXg0KHRyYW5zZm9ybSksIHAxLmFwcGxpZWRNYXRyaXg0KHRyYW5zZm9ybSldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gcG9pbnRzWzFdLnN1YnRyYWN0ZWQocG9pbnRzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZmVyZW5jZU1vZGVsID0geyBwb3NpdGlvbjogaW5mZXJlbmNlUmVzdWx0LnBvc2l0aW9uLCBpbmZlcmVuY2VFbnRpdHk6IGVudGl0eSwgZGlyZWN0aW9uLCBwYXRoOiBpbmZlcmVuY2VSZXN1bHQuaW5zdGFuY2VQYXRoLCB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ck1vZGVsID09PSBudWxsIHx8IGN1ck1vZGVsID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjdXJNb2RlbC50ZW1wU2hhcGVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcFZpZXcuY2xlYXJUZW1wb3JhcnlTaGFwZXNCeUlkcyhbY3VyTW9kZWwudGVtcFNoYXBlSWRdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBTaGFwZUlkID0gKF9rID0gYXBwVmlldy5kcmF3RmxhdExpbmVzKFtwb2ludHNdLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHsgcjogMjU1LCBnOiAwLCBiOiAwIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0dGVybjogS0xpbmVQYXR0ZXJuLlNvbGlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhcFNpemU6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSkgPT09IG51bGwgfHwgX2sgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9rLmlkc1swXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZmVyZW5jZU1vZGVsLnRlbXBTaGFwZUlkID0gdGVtcFNoYXBlSWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGFnZSA9PT0gU3RhZ2UuUGlja1VwTW9kZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGVsID0gaW5mZXJlbmNlTW9kZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhcmdldE1vZGVsID0gaW5mZXJlbmNlTW9kZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VyTW9kZWwucG9zaXRpb24gPSBpbmZlcmVuY2VSZXN1bHQucG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaXNLQXV4aWxpYXJ5TGluZShlbnRpdHkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5lID0gZW50aXR5LmdldExpbmUoKTtcclxuICAgICAgICAgICAgICAgIGlmICghaXNLQXV4aWxpYXJ5TGluZShjdXJNb2RlbCA9PT0gbnVsbCB8fCBjdXJNb2RlbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VyTW9kZWwuaW5mZXJlbmNlRW50aXR5KSB8fCAoY3VyTW9kZWwgPT09IG51bGwgfHwgY3VyTW9kZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1ck1vZGVsLmluZmVyZW5jZUVudGl0eS5nZXRLZXkoKSkgIT09IGVudGl0eS5nZXRLZXkoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgZGlyZWN0aW9uOiBsaW5lRGlyZWN0aW9uLCBvcmlnaW4gfSA9IGxpbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9pbnRzID0gW29yaWdpbi5hZGRlZChsaW5lRGlyZWN0aW9uLm11bHRpcGxpZWQoMTAwMDAwKSkuYXBwbGllZE1hdHJpeDQodHJhbnNmb3JtKSwgb3JpZ2luLmFkZGVkKGxpbmVEaXJlY3Rpb24ubXVsdGlwbGllZCgtMTAwMDAwKSkuYXBwbGllZE1hdHJpeDQodHJhbnNmb3JtKV07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gcG9pbnRzWzFdLnN1YnRyYWN0ZWQocG9pbnRzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICBpbmZlcmVuY2VNb2RlbCA9IHsgcG9zaXRpb246IGluZmVyZW5jZVJlc3VsdC5wb3NpdGlvbiwgaW5mZXJlbmNlRW50aXR5OiBlbnRpdHksIGRpcmVjdGlvbiwgcGF0aDogaW5mZXJlbmNlUmVzdWx0Lmluc3RhbmNlUGF0aCwgfTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyTW9kZWwgPT09IG51bGwgfHwgY3VyTW9kZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1ck1vZGVsLnRlbXBTaGFwZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcFZpZXcuY2xlYXJUZW1wb3JhcnlTaGFwZXNCeUlkcyhbY3VyTW9kZWwudGVtcFNoYXBlSWRdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGVtcFNoYXBlSWQgPSAoX2wgPSBhcHBWaWV3LmRyYXdGbGF0TGluZXMoW3BvaW50c10sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHsgcjogMjU1LCBnOiAwLCBiOiAwIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdHRlcm46IEtMaW5lUGF0dGVybi5Tb2xpZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2FwU2l6ZTogMCxcclxuICAgICAgICAgICAgICAgICAgICB9KSkgPT09IG51bGwgfHwgX2wgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9sLmlkc1swXTtcclxuICAgICAgICAgICAgICAgICAgICBpbmZlcmVuY2VNb2RlbC50ZW1wU2hhcGVJZCA9IHRlbXBTaGFwZUlkO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YWdlID09PSBTdGFnZS5QaWNrVXBNb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGVsID0gaW5mZXJlbmNlTW9kZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhcmdldE1vZGVsID0gaW5mZXJlbmNlTW9kZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGN1ck1vZGVsLnBvc2l0aW9uID0gaW5mZXJlbmNlUmVzdWx0LnBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGlzS0dyb3VwSW5zdGFuY2UoZW50aXR5KSkge1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjdXJNb2RlbCA9PT0gbnVsbCB8fCBjdXJNb2RlbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY3VyTW9kZWwudGVtcFNoYXBlSWQpIHtcclxuICAgICAgICAgICAgYXBwVmlldy5jbGVhclRlbXBvcmFyeVNoYXBlc0J5SWRzKFtjdXJNb2RlbC50ZW1wU2hhcGVJZF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5zdGFnZSA9PT0gU3RhZ2UuUGlja1VwTW9kZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5tb2RlbCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0TW9kZWwgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgb25MQnV0dG9uVXAoZXZlbnQsIGluZmVyZW5jZVJlc3VsdCkge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YWdlID09PSBTdGFnZS5QaWNrVXBNb2RlbCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFnZSA9IFN0YWdlLlBpY2tVcFRhcmdldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGFyZ2V0TW9kZWwpIHtcclxuICAgICAgICAgICAgICAgIGFwcC5kZWFjdGl2YXRlQ3VzdG9tVG9vbCh0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHRyeUNvbW1pdCgpIHtcclxuICAgICAgICBpZiAodGhpcy5tb2RlbCAmJiB0aGlzLnRhcmdldE1vZGVsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlc2lnbiA9IGFwcC5nZXRBY3RpdmVEZXNpZ24oKTtcclxuICAgICAgICAgICAgY29uc3QgZWRpdFBhdGggPSBkZXNpZ24uZ2V0RWRpdFBhdGgoKTtcclxuICAgICAgICAgICAgY29uc3QgZWRpdFRyYW5zZm9ybSA9IGVkaXRQYXRoLnJlZHVjZSgoYWNjLCBpbnN0YW5jZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgYWNjLm11bHRpcGx5KGluc3RhbmNlLmdldFRyYW5zZm9ybSgpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhY2M7XHJcbiAgICAgICAgICAgIH0sIEdlb21MaWIuY3JlYXRlSWRlbnRpdHlNYXRyaXg0KCkpO1xyXG4gICAgICAgICAgICBjb25zdCB7IHBvc2l0aW9uOiBtb2RlbFBvc2l0aW9uLCBpbmZlcmVuY2VFbnRpdHk6IG1vZGVsRW50aXR5LCBub3JtYWw6IG1vZGVsTm9ybWFsLCBkaXJlY3Rpb246IG1vZGVsRGlyZWN0aW9uLCBwYXRoOiBtb2RlbFBhdGggfSA9IHRoaXMubW9kZWw7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgcG9zaXRpb246IHRhcmdldFBvc2l0aW9uLCBub3JtYWw6IHRhcmdldE5vcm1hbCwgZGlyZWN0aW9uOiB0YXJnZXREaXJlY3Rpb24gfSA9IHRoaXMudGFyZ2V0TW9kZWw7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hdCA9IGVkaXRUcmFuc2Zvcm0uaW52ZXJzZWQoKS5tdWx0aXBsaWVkKEdlb21MaWIuY3JlYXRlVHJhbnNsYXRpb25NYXRyaXg0KHRhcmdldFBvc2l0aW9uLnggLSBtb2RlbFBvc2l0aW9uLngsIHRhcmdldFBvc2l0aW9uLnkgLSBtb2RlbFBvc2l0aW9uLnksIHRhcmdldFBvc2l0aW9uLnogLSBtb2RlbFBvc2l0aW9uLnopKTtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0Tm9ybWFsUmV2ZXJzZSA9IHRhcmdldE5vcm1hbCA9PT0gbnVsbCB8fCB0YXJnZXROb3JtYWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHRhcmdldE5vcm1hbC5yZXZlcnNlZCgpO1xyXG4gICAgICAgICAgICBpZiAodGFyZ2V0Tm9ybWFsUmV2ZXJzZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1vZGVsTm9ybWFsICYmICFtb2RlbE5vcm1hbC5pc1BhcmFsbGVsKHRhcmdldE5vcm1hbFJldmVyc2UpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3Jvc3NWZWMgPSBtb2RlbE5vcm1hbC5jcm9zcyh0YXJnZXROb3JtYWxSZXZlcnNlKS5ub3JtYWxpemVkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nZWwgPSBtb2RlbE5vcm1hbC5hbmdsZVRvKHRhcmdldE5vcm1hbFJldmVyc2UsIGNyb3NzVmVjKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByb3RhdGVNYXRyaXggPSBHZW9tTGliLmNyZWF0ZVJvdGF0ZU1hdHJpeDQoYW5nZWwsIGNyb3NzVmVjLCB0aGlzLm1vZGVsLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICBtYXQubXVsdGlwbHkocm90YXRlTWF0cml4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1vZGVsRGlyZWN0aW9uICYmICFtb2RlbERpcmVjdGlvbi5pc1BlcnBlbmRpY3VsYXIodGFyZ2V0Tm9ybWFsUmV2ZXJzZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjcm9zc1ZlYzEgPSBtb2RlbERpcmVjdGlvbi5jcm9zcyh0YXJnZXROb3JtYWxSZXZlcnNlKS5ub3JtYWxpemVkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nZWwxID0gbW9kZWxEaXJlY3Rpb24uYW5nbGVUbyh0YXJnZXROb3JtYWxSZXZlcnNlLCBjcm9zc1ZlYzEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvdGF0ZU1hdHJpeDEgPSBHZW9tTGliLmNyZWF0ZVJvdGF0ZU1hdHJpeDQoYW5nZWwxIC0gTWF0aC5QSSAvIDIgKiAoYW5nZWwxID4gTWF0aC5QSSA/IDMgOiAxKSwgY3Jvc3NWZWMxLCB0aGlzLm1vZGVsLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICBtYXQubXVsdGlwbHkocm90YXRlTWF0cml4MSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGFyZ2V0RGlyZWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobW9kZWxOb3JtYWwgJiYgIW1vZGVsTm9ybWFsLmlzUGVycGVuZGljdWxhcih0YXJnZXREaXJlY3Rpb24pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3Jvc3NWZWMyID0gbW9kZWxOb3JtYWwuY3Jvc3ModGFyZ2V0RGlyZWN0aW9uKS5ub3JtYWxpemVkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5nZWwyID0gbW9kZWxOb3JtYWwuYW5nbGVUbyh0YXJnZXREaXJlY3Rpb24sIGNyb3NzVmVjMik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm90YXRlTWF0cml4MSA9IEdlb21MaWIuY3JlYXRlUm90YXRlTWF0cml4NChhbmdlbDIgLSBNYXRoLlBJIC8gMiAqIChhbmdlbDIgPiBNYXRoLlBJID8gMyA6IDEpLCBjcm9zc1ZlYzIsIHRoaXMubW9kZWwucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdC5tdWx0aXBseShyb3RhdGVNYXRyaXgxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1vZGVsRGlyZWN0aW9uICYmICFtb2RlbERpcmVjdGlvbi5pc1BhcmFsbGVsKHRhcmdldERpcmVjdGlvbikpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjcm9zc1ZlYzMgPSBtb2RlbERpcmVjdGlvbi5jcm9zcyh0YXJnZXREaXJlY3Rpb24pLm5vcm1hbGl6ZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhbmdlbDMgPSBtb2RlbERpcmVjdGlvbi5hbmdsZVRvKHRhcmdldERpcmVjdGlvbiwgY3Jvc3NWZWMzKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByb3RhdGVNYXRyaXgxID0gR2VvbUxpYi5jcmVhdGVSb3RhdGVNYXRyaXg0KGFuZ2VsMyAtIE1hdGguUEkgLyAyICogKGFuZ2VsMyA+IE1hdGguUEkgPyAzIDogMSksIGNyb3NzVmVjMywgdGhpcy5tb2RlbC5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0Lm11bHRpcGx5KHJvdGF0ZU1hdHJpeDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1hdC5tdWx0aXBseShlZGl0VHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0VG9UcmFuc2Zvcm0gPSBtb2RlbFBhdGguZmluZChpbnN0YW5jZSA9PiAhZWRpdFBhdGguc29tZShpbnMgPT4gaW5zLmdldEtleSgpID09PSBpbnN0YW5jZS5nZXRLZXkoKSkpIHx8IG1vZGVsRW50aXR5O1xyXG4gICAgICAgICAgICBsZXQgdHJhbnNmb3JtU3VjY2VzcyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoaXNLRmFjZSh0YXJnZXRUb1RyYW5zZm9ybSkgfHwgaXNLRWRnZSh0YXJnZXRUb1RyYW5zZm9ybSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoZWxsID0gdGFyZ2V0VG9UcmFuc2Zvcm0uZ2V0U2hlbGwoKTtcclxuICAgICAgICAgICAgICAgIGlmIChzaGVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybVN1Y2Nlc3MgPSBkZXNpZ24udHJhbnNmb3JtU2hlbGxzKFtzaGVsbF0sIG1hdCkuaXNTdWNjZXNzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGlzS1ZlcnRleCh0YXJnZXRUb1RyYW5zZm9ybSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoZWxsID0gdGFyZ2V0VG9UcmFuc2Zvcm0uZ2V0RWRnZXMoKVswXS5nZXRTaGVsbCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNoZWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtU3VjY2VzcyA9IGRlc2lnbi50cmFuc2Zvcm1TaGVsbHMoW3NoZWxsXSwgbWF0KS5pc1N1Y2Nlc3M7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaXNLQXV4aWxpYXJ5Qm91bmRlZEN1cnZlKHRhcmdldFRvVHJhbnNmb3JtKSB8fCBpc0tBdXhpbGlhcnlMaW5lKHRhcmdldFRvVHJhbnNmb3JtKSkge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtU3VjY2VzcyA9IGRlc2lnbi50cmFuc2Zvcm1BdXhpbGlhcnlDdXJ2ZXMoW3RhcmdldFRvVHJhbnNmb3JtXSwgbWF0KS5pc1N1Y2Nlc3M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaXNLR3JvdXBJbnN0YW5jZSh0YXJnZXRUb1RyYW5zZm9ybSkpIHtcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybVN1Y2Nlc3MgPSBkZXNpZ24udHJhbnNmb3JtR3JvdXBJbnN0YW5jZXMoW3RhcmdldFRvVHJhbnNmb3JtXSwgbWF0KS5pc1N1Y2Nlc3M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRyYW5zZm9ybVN1Y2Nlc3MpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IGFwcC5nZXRTZWxlY3Rpb24oKTtcclxuICAgICAgICAgICAgICAgIHNlbGVjdGlvbi5hZGQoW3RhcmdldFRvVHJhbnNmb3JtXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gY29uc3QgcGlja0hlbHBlciA9IGFwcC5nZXRQaWNrSGVscGVyKCk7XHJcbiAgICAgICAgICAgIC8vIC8vIGNvbnN0IHBpY2thYmxlRW50aXR5VHlwZSA9IHRoaXMubW9kZWwgPyBbS0VudGl0eVR5cGUuQXV4aWxpYXJ5Qm91bmRlZEN1cnZlXSA6IFtLQXBwRW50aXR5VHlwZS5Hcm91cEluc3RhbmNlLCBLRW50aXR5VHlwZS5GYWNlXTtcclxuICAgICAgICAgICAgLy8gY29uc3QgYWxsUGlja2VkRW50aXRpZXMgPSBwaWNrSGVscGVyLnBpY2tCeVBvaW50KGV2ZW50LmNsaWVudFgoKSwgZXZlbnQuY2xpZW50WSgpKS5nZXRBbGxQaWNrZWQoKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYWxsUGlja2VkRW50aXRpZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNsZWFyKCkge1xyXG4gICAgICAgIGNvbnN0IGFwcFZpZXcgPSBhcHAuZ2V0QWN0aXZlVmlldygpO1xyXG4gICAgICAgIGFwcFZpZXcuY2xlYXJUZW1wb3JhcnlTaGFwZXMoKTtcclxuICAgICAgICB0aGlzLm1vZGVsID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0TW9kZWwgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhpcy5zdGFnZSA9IFN0YWdlLlBpY2tVcE1vZGVsO1xyXG4gICAgfVxyXG4gICAgb25SQnV0dG9uVXAoZXZlbnQsIGluZmVyZW5jZVJlc3VsdCkge1xyXG4gICAgICAgIGFwcC5kZWFjdGl2YXRlQ3VzdG9tVG9vbCh0aGlzKTtcclxuICAgIH1cclxuICAgIG9uTEJ1dHRvbkRiQ2xpY2soZXZlbnQsIGluZmVyZW5jZVJlc3VsdCkge1xyXG4gICAgICAgIDtcclxuICAgIH1cclxuICAgIGFsbG93VXNpbmdJbmZlcmVuY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBvbktleURvd24oZXZlbnQpIHtcclxuICAgICAgICA7XHJcbiAgICB9XHJcbiAgICBvbktleVVwKGV2ZW50KSB7XHJcbiAgICAgICAgO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjb25zdCBwYXRjaE1ha2VHcm91cFRvb2wgPSBuZXcgUGF0Y2hNYWtlR3JvdXBUb29sKCk7XHJcbiIsImV4cG9ydCBjb25zdCBDb21wb25lbnRQcm9wZXJ0eUtleSA9ICdQQUNvbXBvbmVudCc7XHJcbmV4cG9ydCBjb25zdCBJbnRlcnZhbFByb3BlcnR5S2V5ID0gJ1BBSW50ZXJ2YWwnO1xyXG5leHBvcnQgY29uc3QgQ291bnRQcm9wZXJ0eUtleSA9ICdQQUNvdW50JztcclxuZXhwb3J0IGNvbnN0IFBhdGhBeGlzUHJvcGVydHlLZXkgPSAnUEFQYXRoQXhpcyc7XHJcbmV4cG9ydCBjb25zdCBOb3JtYWxBeGlzUHJvcGVydHlLZXkgPSAnUEFOb3JtYWxBeGlzJztcclxuZXhwb3J0IGNvbnN0IFNjYWxlUHJvcGVydHlLZXkgPSAnUEFTY2FsZSc7XHJcbmV4cG9ydCBjb25zdCBQYXRoTGlzdFByb3BlcnR5S2V5ID0gJ1BBUGF0aExpc3QnO1xyXG5leHBvcnQgY29uc3QgUGF0aFJldmVyc2VkRGVsaW1pdGVyID0gJy0nO1xyXG5leHBvcnQgY29uc3QgUGF0aERlbGltaXRlciA9ICcmJztcclxuZXhwb3J0IGNvbnN0IE1hbnVhbFByZWZpeCA9ICdtJztcclxuZXhwb3J0IGZ1bmN0aW9uIGlzQXhpc1ZhbGlkKGF4aXMpIHtcclxuICAgIHJldHVybiBheGlzID09PSBcIlhcIiAvKiBBeGlzLlggKi8gfHwgYXhpcyA9PT0gXCItWFwiIC8qIEF4aXMuWE1pbnVzICovIHx8IGF4aXMgPT09IFwiWVwiIC8qIEF4aXMuWSAqLyB8fCBheGlzID09PSBcIi1ZXCIgLyogQXhpcy5ZTWludXMgKi8gfHwgYXhpcyA9PT0gXCJaXCIgLyogQXhpcy5aICovIHx8IGF4aXMgPT09IFwiLVpcIiAvKiBBeGlzLlpNaW51cyAqLztcclxufVxyXG5leHBvcnQgY29uc3QgRGVmYXVsdFBhdGhBcnJheVBhcmFtcyA9IHtcclxuICAgIGludGVydmFsOiB7IHZhbHVlOiAxMDAwLCBtaW46IDEwLCBtYXg6IDk5OTk5OTkgfSxcclxuICAgIGNvdW50OiB7IHZhbHVlOiA1LCBtaW46IDEsIG1heDogMTAwIH0sXHJcbiAgICBwYXRoQXhpczogXCJYXCIgLyogQXhpcy5YICovLFxyXG4gICAgbm9ybWFsQXhpczogXCJaXCIgLyogQXhpcy5aICovLFxyXG4gICAgc2NhbGU6IHsgdmFsdWU6IDEsIG1pbjogMC4wMSwgbWF4OiAxMDAwIH0sXHJcbn07XHJcbmV4cG9ydCBjb25zdCBkdW1teU1hdHJpeDQgPSBHZW9tTGliLmNyZWF0ZUlkZW50aXR5TWF0cml4NCgpO1xyXG5leHBvcnQgY29uc3QgZHVtbXlWZWN0b3IzZCA9IEdlb21MaWIuY3JlYXRlVmVjdG9yM2QoMCwgMCwgMSk7XHJcbmV4cG9ydCBjb25zdCBkdW1teVBvaW50M2QgPSBHZW9tTGliLmNyZWF0ZVBvaW50M2QoMCwgMCwgMCk7XHJcbiIsImltcG9ydCB7IGR1bW15UG9pbnQzZCwgZHVtbXlWZWN0b3IzZCB9IGZyb20gXCIuL3R5cGVzXCI7XHJcbmV4cG9ydCBmdW5jdGlvbiBpc0tBcmNoRmFjZShlbnRpdHkpIHtcclxuICAgIHJldHVybiAhIWVudGl0eSAmJiAoZW50aXR5LmdldFR5cGUoKSA9PT0gS0FyY2hGYWNlVHlwZS5Ob25QbGFuYXIgfHwgZW50aXR5LmdldFR5cGUoKSA9PT0gS0FyY2hGYWNlVHlwZS5QbGFuYXIpO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBpc0tHcm91cEluc3RhbmNlKGVudGl0eSkge1xyXG4gICAgcmV0dXJuICEhZW50aXR5ICYmIGVudGl0eS5nZXRUeXBlKCkgPT09IEtFbnRpdHlUeXBlLkdyb3VwSW5zdGFuY2U7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGlzS0ZhY2UoZW50aXR5KSB7XHJcbiAgICByZXR1cm4gISFlbnRpdHkgJiYgZW50aXR5LmdldFR5cGUoKSA9PT0gS0VudGl0eVR5cGUuRmFjZTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gaXNLRWRnZShlbnRpdHkpIHtcclxuICAgIHJldHVybiAhIWVudGl0eSAmJiBlbnRpdHkuZ2V0VHlwZSgpID09PSBLRW50aXR5VHlwZS5FZGdlO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBpc0tWZXJ0ZXgoZW50aXR5KSB7XHJcbiAgICByZXR1cm4gISFlbnRpdHkgJiYgZW50aXR5LmdldFR5cGUoKSA9PT0gS0VudGl0eVR5cGUuVmVydGV4O1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBpc0tBdXhpbGlhcnlCb3VuZGVkQ3VydmUoZW50aXR5KSB7XHJcbiAgICByZXR1cm4gISFlbnRpdHkgJiYgZW50aXR5LmdldFR5cGUoKSA9PT0gS0VudGl0eVR5cGUuQXV4aWxpYXJ5Qm91bmRlZEN1cnZlO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBpc0tBdXhpbGlhcnlMaW5lKGVudGl0eSkge1xyXG4gICAgcmV0dXJuICEhZW50aXR5ICYmIGVudGl0eS5nZXRUeXBlKCkgPT09IEtFbnRpdHlUeXBlLkF1eGlsaWFyeUxpbmU7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGlzS1BsYW5lKGVudGl0eSkge1xyXG4gICAgcmV0dXJuICEhZW50aXR5ICYmIGVudGl0eS5nZXRUeXBlKCkgPT09IEtTdXJmYWNlVHlwZS5QbGFuZTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gaXNLTGluZVNlZ21lbnQzZChlbnRpdHkpIHtcclxuICAgIHJldHVybiAhIWVudGl0eSAmJiAhIWVudGl0eS5kaXJlY3Rpb247XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGlzS0FyYzNkKGVudGl0eSkge1xyXG4gICAgcmV0dXJuICEhZW50aXR5ICYmICEhZW50aXR5LmNpcmNsZTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gYm91bmRlZEN1cnZlQ29ubmVjdGlvbkRldGVjdChhdXhpbGlhcnlWZXJ0ZXgsIGF1eGlsaWFyeUJvdW5kZWRDdXJ2ZSkge1xyXG4gICAgY29uc3Qgc3RhcnRWZXJ0ZXggPSBhdXhpbGlhcnlCb3VuZGVkQ3VydmUuZ2V0U3RhcnRWZXJ0ZXgoKTtcclxuICAgIGNvbnN0IGVuZFZlcnRleCA9IGF1eGlsaWFyeUJvdW5kZWRDdXJ2ZS5nZXRTdGFydFZlcnRleCgpO1xyXG4gICAgaWYgKHN0YXJ0VmVydGV4LmdldEtleSgpID09PSBhdXhpbGlhcnlWZXJ0ZXguZ2V0S2V5KCkpIHtcclxuICAgICAgICByZXR1cm4geyBjb25uZWN0ZWQ6IHRydWUsIHJldmVyc2VkOiBmYWxzZSB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoZW5kVmVydGV4LmdldEtleSgpID09PSBhdXhpbGlhcnlWZXJ0ZXguZ2V0S2V5KCkpIHtcclxuICAgICAgICByZXR1cm4geyBjb25uZWN0ZWQ6IHRydWUsIHJldmVyc2VkOiB0cnVlIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4geyBjb25uZWN0ZWQ6IGZhbHNlLCByZXZlcnNlZDogZmFsc2UgfTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZGlzY3JldGVBdXhpbGlhcnlCb3VuZGVkQ3VydmUoYXV4aWxpYXJ5Qm91bmRlZEN1cnZlKSB7XHJcbiAgICBjb25zdCBib3VuZGVkQ3VydmUgPSBhdXhpbGlhcnlCb3VuZGVkQ3VydmUuZ2V0Qm91bmRlZEN1cnZlKCk7XHJcbiAgICBsZXQgZGlzY3JldGVQb2ludHMgPSBbXTtcclxuICAgIGlmIChib3VuZGVkQ3VydmUpIHtcclxuICAgICAgICBpZiAoaXNLTGluZVNlZ21lbnQzZChib3VuZGVkQ3VydmUpKSB7XHJcbiAgICAgICAgICAgIGRpc2NyZXRlUG9pbnRzID0gW2JvdW5kZWRDdXJ2ZS5zdGFydFBvaW50LCBib3VuZGVkQ3VydmUuZW5kUG9pbnRdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChpc0tBcmMzZChib3VuZGVkQ3VydmUpKSB7XHJcbiAgICAgICAgICAgIGRpc2NyZXRlUG9pbnRzID0gYm91bmRlZEN1cnZlLmdldEFwcHJveGltYXRlUG9pbnRzQnlBbmdsZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBkaXNjcmV0ZVBvaW50cztcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXV4aWxpYXJ5Qm91bmRlZEN1cnZlTm9ybWFsKGF1eGlsaWFyeUJvdW5kZWRDdXJ2ZSkge1xyXG4gICAgY29uc3QgYm91bmRlZEN1cnZlID0gYXV4aWxpYXJ5Qm91bmRlZEN1cnZlLmdldEJvdW5kZWRDdXJ2ZSgpO1xyXG4gICAgaWYgKGJvdW5kZWRDdXJ2ZSkge1xyXG4gICAgICAgIGlmIChpc0tBcmMzZChib3VuZGVkQ3VydmUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBib3VuZGVkQ3VydmUubm9ybWFsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE5vcm1hbEJ5WCh4QXhpcykge1xyXG4gICAgaWYgKHhBeGlzLmlzUGFyYWxsZWwoZHVtbXlWZWN0b3IzZCkpIHtcclxuICAgICAgICBpZiAoeEF4aXMueiA+IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIEdlb21MaWIuY3JlYXRlVmVjdG9yM2QoLTEsIDAsIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIEdlb21MaWIuY3JlYXRlVmVjdG9yM2QoMSwgMCwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHhBeGlzLmNyb3NzKGR1bW15VmVjdG9yM2QuY3Jvc3MoeEF4aXMpKS5ub3JtYWxpemVkKCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlUGF0aFBvc2VzKHBhdGgpIHtcclxuICAgIGNvbnN0IHBhdGhQb2ludFBvc2VzID0gW107XHJcbiAgICBsZXQgYWNjdW11bGF0ZUxlbmd0aCA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdGgubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBwYXRoT2JqZWN0ID0gcGF0aFtpXTtcclxuICAgICAgICBjb25zdCBkaXNjcmV0ZVBvaW50cyA9IGRpc2NyZXRlQXV4aWxpYXJ5Qm91bmRlZEN1cnZlKHBhdGhPYmplY3QuY3VydmUpO1xyXG4gICAgICAgIGlmIChkaXNjcmV0ZVBvaW50cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgYm91bmRlZEN1cnZlTm9ybWFsID0gZ2V0QXV4aWxpYXJ5Qm91bmRlZEN1cnZlTm9ybWFsKHBhdGhPYmplY3QuY3VydmUpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRpc2NyZXRlUG9pbnRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaXNjcmV0ZVBvaW50ID0gZGlzY3JldGVQb2ludHNbal07XHJcbiAgICAgICAgICAgICAgICBpZiAoaiA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHREaXNjcmV0ZVBvaW50ID0gZGlzY3JldGVQb2ludHNbaiArIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoUG9pbnRQb3Nlcy5wdXNoKHsgcG9pbnQ6IGRpc2NyZXRlUG9pbnRzWzBdLCBkaXJlY3Rpb246IG5leHREaXNjcmV0ZVBvaW50LnN1YnRyYWN0ZWQoZGlzY3JldGVQb2ludCkubm9ybWFsaXplZCgpLCBhY2N1bXVsYXRlTGVuZ3RoIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZXZEaXNjcmV0ZVBvaW50ID0gZGlzY3JldGVQb2ludHNbaiAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IGRpc2NyZXRlUG9pbnQuc3VidHJhY3RlZChwcmV2RGlzY3JldGVQb2ludCkubm9ybWFsaXplZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlZ21lbnRMZW5ndGggPSBwcmV2RGlzY3JldGVQb2ludC5kaXN0YW5jZVRvKGRpc2NyZXRlUG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGFjY3VtdWxhdGVMZW5ndGggKz0gc2VnbWVudExlbmd0aDtcclxuICAgICAgICAgICAgICAgICAgICBwYXRoUG9pbnRQb3Nlcy5wdXNoKHsgcG9pbnQ6IGRpc2NyZXRlUG9pbnQsIGRpcmVjdGlvbiwgYWNjdW11bGF0ZUxlbmd0aCB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHBhdGhQb2ludFBvc2VzW3BhdGhQb2ludFBvc2VzLmxlbmd0aCAtIDFdLm5vcm1hbCA9IGJvdW5kZWRDdXJ2ZU5vcm1hbCA/IGJvdW5kZWRDdXJ2ZU5vcm1hbCA6IGdldE5vcm1hbEJ5WChwYXRoUG9pbnRQb3Nlc1twYXRoUG9pbnRQb3Nlcy5sZW5ndGggLSAxXS5kaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHsgcGF0aFBvaW50UG9zZXMsIHRvdGFsTGVuZ3RoOiBhY2N1bXVsYXRlTGVuZ3RoIH07XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFRyYW5zZm9ybUZyb21QYXRoUG9pbnRQb3NlcyhwYXRoUG9pbnRQb3NlcywgcGFyYW1zKSB7XHJcbiAgICBjb25zdCB7IGNvdW50LCBpbnRlcnZhbCwgc2NhbGUsIHBhdGhBeGlzLCBub3JtYWxBeGlzIH0gPSBwYXJhbXM7XHJcbiAgICBjb25zdCBjb21wb25lbnRUcmFuc2Zvcm1zID0gW107XHJcbiAgICBjb25zdCBzY2FsZU1hdHJpeCA9IEdlb21MaWIuY3JlYXRlU2NhbGVNYXRyaXg0KHNjYWxlLnZhbHVlLCBzY2FsZS52YWx1ZSwgc2NhbGUudmFsdWUpO1xyXG4gICAgbGV0IGNvbXBvbmVudEluZGV4ID0gMDtcclxuICAgIGxldCBjb21wb25lbnRQb3NpdGlvbkxlbmd0aCA9IGNvbXBvbmVudEluZGV4ICogaW50ZXJ2YWwudmFsdWU7XHJcbiAgICBmb3IgKGxldCBrID0gMDsgayA8IHBhdGhQb2ludFBvc2VzLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgY29uc3QgeyBwb2ludCwgbm9ybWFsLCBkaXJlY3Rpb24sIGFjY3VtdWxhdGVMZW5ndGggfSA9IHBhdGhQb2ludFBvc2VzW2tdO1xyXG4gICAgICAgIGNvbnN0IHByZXZBY2N1bXVsYXRlTGVuZ3RoID0gayA9PT0gMCA/IC0xIDogcGF0aFBvaW50UG9zZXNbayAtIDFdLmFjY3VtdWxhdGVMZW5ndGg7XHJcbiAgICAgICAgbGV0IGNvbXBvbmVudFRyYW5zZm9ybTtcclxuICAgICAgICBjb25zdCBwYXRoTm9ybWFsID0gbm9ybWFsIHx8IGR1bW15VmVjdG9yM2Q7XHJcbiAgICAgICAgbGV0IGNjc1g7XHJcbiAgICAgICAgbGV0IGNjc1k7XHJcbiAgICAgICAgbGV0IGNjc1o7XHJcbiAgICAgICAgc3dpdGNoIChwYXRoQXhpcykge1xyXG4gICAgICAgICAgICBjYXNlIFwiWFwiIC8qIEF4aXMuWCAqLzpcclxuICAgICAgICAgICAgICAgIGNjc1ggPSBkaXJlY3Rpb247XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIi1YXCIgLyogQXhpcy5YTWludXMgKi86XHJcbiAgICAgICAgICAgICAgICBjY3NYID0gZGlyZWN0aW9uLnJldmVyc2VkKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIllcIiAvKiBBeGlzLlkgKi86XHJcbiAgICAgICAgICAgICAgICBjY3NZID0gZGlyZWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCItWVwiIC8qIEF4aXMuWU1pbnVzICovOlxyXG4gICAgICAgICAgICAgICAgY2NzWSA9IGRpcmVjdGlvbi5yZXZlcnNlZCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJaXCIgLyogQXhpcy5aICovOlxyXG4gICAgICAgICAgICAgICAgY2NzWiA9IGRpcmVjdGlvbjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiLVpcIiAvKiBBeGlzLlpNaW51cyAqLzpcclxuICAgICAgICAgICAgICAgIGNjc1ogPSBkaXJlY3Rpb24ucmV2ZXJzZWQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKG5vcm1hbEF4aXMpIHtcclxuICAgICAgICAgICAgY2FzZSBcIlhcIiAvKiBBeGlzLlggKi86XHJcbiAgICAgICAgICAgICAgICBjY3NYID0gcGF0aE5vcm1hbDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiLVhcIiAvKiBBeGlzLlhNaW51cyAqLzpcclxuICAgICAgICAgICAgICAgIGNjc1ggPSBwYXRoTm9ybWFsLnJldmVyc2VkKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIllcIiAvKiBBeGlzLlkgKi86XHJcbiAgICAgICAgICAgICAgICBjY3NZID0gcGF0aE5vcm1hbDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiLVlcIiAvKiBBeGlzLllNaW51cyAqLzpcclxuICAgICAgICAgICAgICAgIGNjc1kgPSBwYXRoTm9ybWFsLnJldmVyc2VkKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIlpcIiAvKiBBeGlzLlogKi86XHJcbiAgICAgICAgICAgICAgICBjY3NaID0gcGF0aE5vcm1hbDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiLVpcIiAvKiBBeGlzLlpNaW51cyAqLzpcclxuICAgICAgICAgICAgICAgIGNjc1ogPSBwYXRoTm9ybWFsLnJldmVyc2VkKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFjY3NYKSB7XHJcbiAgICAgICAgICAgIGNjc1ggPSBjY3NZLmNyb3NzKGNjc1opO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWNjc1kpIHtcclxuICAgICAgICAgICAgY2NzWSA9IGNjc1ouY3Jvc3MoY2NzWCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghY2NzWikge1xyXG4gICAgICAgICAgICBjY3NaID0gY2NzWC5jcm9zcyhjY3NZKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2hpbGUgKGNvbXBvbmVudEluZGV4IDwgY291bnQudmFsdWUgJiYgY29tcG9uZW50UG9zaXRpb25MZW5ndGggPiBwcmV2QWNjdW11bGF0ZUxlbmd0aCAmJiBjb21wb25lbnRQb3NpdGlvbkxlbmd0aCA8PSBhY2N1bXVsYXRlTGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudFBvc2l0aW9uID0gcG9pbnQuYWRkZWQoZGlyZWN0aW9uLm11bHRpcGxpZWQoY29tcG9uZW50UG9zaXRpb25MZW5ndGggLSBhY2N1bXVsYXRlTGVuZ3RoKSk7XHJcbiAgICAgICAgICAgIGNvbXBvbmVudFRyYW5zZm9ybSA9IEdlb21MaWIuY3JlYXRlVHJhbnNsYXRpb25NYXRyaXg0KGNvbXBvbmVudFBvc2l0aW9uLngsIGNvbXBvbmVudFBvc2l0aW9uLnksIGNvbXBvbmVudFBvc2l0aW9uLnopXHJcbiAgICAgICAgICAgICAgICAubXVsdGlwbGllZChHZW9tTGliLmNyZWF0ZUFsaWduQ0NTTWF0cml4NChjY3NYLCBjY3NZLCBjY3NaLCBkdW1teVBvaW50M2QpKVxyXG4gICAgICAgICAgICAgICAgLm11bHRpcGxpZWQoc2NhbGVNYXRyaXgpO1xyXG4gICAgICAgICAgICBjb21wb25lbnRUcmFuc2Zvcm1zLnB1c2goY29tcG9uZW50VHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgY29tcG9uZW50SW5kZXgrKztcclxuICAgICAgICAgICAgY29tcG9uZW50UG9zaXRpb25MZW5ndGggPSBjb21wb25lbnRJbmRleCAqIGludGVydmFsLnZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBjb21wb25lbnRUcmFuc2Zvcm1zO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRCb3VuZGluZ0JveFNpemVJbldvcmxkKGdyb3VwSW5zdGFuY2UpIHtcclxuICAgIGNvbnN0IGxvY2FsQm91bmRpbmdCb3ggPSBncm91cEluc3RhbmNlLmdldExvY2FsQm91bmRpbmdCb3goKTtcclxuICAgIGNvbnN0IHRyYW5zZm9ybSA9IGdyb3VwSW5zdGFuY2UuZ2V0VHJhbnNmb3JtKCk7XHJcbiAgICBjb25zdCBvbGRTaXplID0gW0dlb21MaWIuY3JlYXRlVmVjdG9yM2QobG9jYWxCb3VuZGluZ0JveC53aWR0aCwgMCwgMCksIEdlb21MaWIuY3JlYXRlVmVjdG9yM2QoMCwgbG9jYWxCb3VuZGluZ0JveC5oZWlnaHQsIDApLCBHZW9tTGliLmNyZWF0ZVZlY3RvcjNkKDAsIDAsIGxvY2FsQm91bmRpbmdCb3guZGVwdGgpXTtcclxuICAgIHJldHVybiBvbGRTaXplLm1hcCh2ZWMgPT4gdmVjLmFwcGxpZWRNYXRyaXg0KHRyYW5zZm9ybSkubGVuZ3RoKTtcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RXh0ZW5kZWRUcmFuc2Zvcm0oKSB7XHJcbiAgICBjb25zdCBkZXNpZ24gPSBhcHAuZ2V0QWN0aXZlRGVzaWduKCk7XHJcbiAgICBjb25zdCBlZGl0UGF0aCA9IGRlc2lnbi5nZXRFZGl0UGF0aCgpO1xyXG4gICAgY29uc3QgZXh0ZW5kZWRUcmFuc2Zvcm0gPSBHZW9tTGliLmNyZWF0ZUlkZW50aXR5TWF0cml4NCgpO1xyXG4gICAgZm9yIChjb25zdCBwYXRoIG9mIGVkaXRQYXRoKSB7XHJcbiAgICAgICAgZXh0ZW5kZWRUcmFuc2Zvcm0ubXVsdGlwbHkocGF0aC5nZXRUcmFuc2Zvcm0oKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZXh0ZW5kZWRUcmFuc2Zvcm07XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRQYXRoQWZ0ZXJNYWtlR3JvdXAocGF0aCwgbmV3R3JvdXBJbnN0YW5jZSkge1xyXG4gICAgdmFyIF9hO1xyXG4gICAgY29uc3QgYXV4aWxpYXJ5Qm91bmRlZEN1cnZlcyA9IFtdO1xyXG4gICAgKF9hID0gbmV3R3JvdXBJbnN0YW5jZS5nZXRHcm91cERlZmluaXRpb24oKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmdldEF1eGlsaWFyeUN1cnZlcygpLmZvckVhY2goY3VydmUgPT4ge1xyXG4gICAgICAgIGlmIChpc0tBdXhpbGlhcnlCb3VuZGVkQ3VydmUoY3VydmUpKSB7XHJcbiAgICAgICAgICAgIGF1eGlsaWFyeUJvdW5kZWRDdXJ2ZXMucHVzaChjdXJ2ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBjb25zdCBuZXdQYXRoID0gW107XHJcbiAgICBmb3IgKGNvbnN0IHsgY3VydmUsIHJldmVyc2VkIH0gb2YgcGF0aCkge1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0UG9pbnQgPSBjdXJ2ZS5nZXRTdGFydFZlcnRleCgpLmdldFBvaW50KCk7XHJcbiAgICAgICAgY29uc3QgZW5kUG9pbnQgPSBjdXJ2ZS5nZXRFbmRWZXJ0ZXgoKS5nZXRQb2ludCgpO1xyXG4gICAgICAgIGNvbnN0IG5ld0N1cnZlSW5kZXggPSBhdXhpbGlhcnlCb3VuZGVkQ3VydmVzLmZpbmRJbmRleChuZXdDdXJ2ZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1N0YXJ0UG9pbnQgPSBuZXdDdXJ2ZS5nZXRTdGFydFZlcnRleCgpLmdldFBvaW50KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld0VuZFBvaW50ID0gbmV3Q3VydmUuZ2V0RW5kVmVydGV4KCkuZ2V0UG9pbnQoKTtcclxuICAgICAgICAgICAgaWYgKG5ld1N0YXJ0UG9pbnQuaXNFcXVhbChzdGFydFBvaW50KSAmJiBuZXdFbmRQb2ludC5pc0VxdWFsKGVuZFBvaW50KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChuZXdDdXJ2ZUluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgbmV3UGF0aC5wdXNoKHsgY3VydmU6IGF1eGlsaWFyeUJvdW5kZWRDdXJ2ZXNbbmV3Q3VydmVJbmRleF0sIHJldmVyc2VkIH0pO1xyXG4gICAgICAgICAgICBhdXhpbGlhcnlCb3VuZGVkQ3VydmVzLnNwbGljZShuZXdDdXJ2ZUluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ld1BhdGg7XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbmltcG9ydCB7IGFsaWduVG9vbCB9IGZyb20gXCIuL0FsaWduVG9vbFwiO1xyXG5pbXBvcnQgeyBwYXRjaE1ha2VHcm91cFRvb2wgfSBmcm9tIFwiLi9QYXRjaE1ha2VHcm91cFRvb2xcIjtcclxuY29uc3QgcGx1Z2luVUkgPSBhcHAuZ2V0UGx1Z2luVUkoKTtcclxucGx1Z2luVUkucmVzaXplKDI0MCwgNzAwKTtcclxucGx1Z2luVUkubW91bnQoKTtcclxubGV0IGFjdGl2YXRlZEN1c3RvbVRvb2w7XHJcbmZ1bmN0aW9uIG9uVUlNZXNzYWdlKGRhdGEpIHtcclxuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGRhdGEudHlwZSA9PT0gJ2FjdGl2YXRlQWxpZ25Ub29sJykge1xyXG4gICAgICAgICAgICAgICAgYXBwLmFjdGl2YXRlQ3VzdG9tVG9vbChhbGlnblRvb2wsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgYWN0aXZhdGVkQ3VzdG9tVG9vbCA9IGFsaWduVG9vbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChkYXRhLnR5cGUgPT09ICdkZUFjdGl2YXRlQWxpZ25Ub29sJykge1xyXG4gICAgICAgICAgICAgICAgYXBwLmRlYWN0aXZhdGVDdXN0b21Ub29sKGFsaWduVG9vbCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgYWN0aXZhdGVkQ3VzdG9tVG9vbCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFjdGl2YXRlZEN1c3RvbVRvb2wpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChkYXRhLnR5cGUgPT09ICdhY3RpdmF0ZVBhdGNoTWFrZUdyb3VwVG9vbCcpIHtcclxuICAgICAgICAgICAgICAgIGFwcC5hY3RpdmF0ZUN1c3RvbVRvb2wocGF0Y2hNYWtlR3JvdXBUb29sLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIGFjdGl2YXRlZEN1c3RvbVRvb2wgPSBhbGlnblRvb2w7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZGF0YS50eXBlID09PSAnZGVBY3RpdmF0ZVBhdGNoTWFrZUdyb3VwVG9vbCcpIHtcclxuICAgICAgICAgICAgICAgIGFwcC5kZWFjdGl2YXRlQ3VzdG9tVG9vbChwYXRjaE1ha2VHcm91cFRvb2wsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGFjdGl2YXRlZEN1c3RvbVRvb2wgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhY3RpdmF0ZWRDdXN0b21Ub29sKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgIGNsb3NlUGx1Z2luKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxucGx1Z2luVUkub25NZXNzYWdlKG9uVUlNZXNzYWdlKTtcclxuY29uc3Qgc2VsZWN0aW9uID0gYXBwLmdldFNlbGVjdGlvbigpO1xyXG5zZWxlY3Rpb24uYWRkT2JzZXJ2ZXIoe1xyXG4gICAgb25TZWxlY3Rpb25DaGFuZ2U6ICgpID0+IHtcclxuICAgIH1cclxufSk7XHJcbi8vIGZ1bmN0aW9uIG9uUGx1Z2luU3RhcnRVcCgpIHtcclxuLy8gfVxyXG4vLyBvblBsdWdpblN0YXJ0VXAoKTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9