import { groupFacesByConnection, isKArc3d, isKAuxiliaryBoundedCurve, isKAuxiliaryLine, isKEdge, isKFace, isKGroupInstance, isKPlane, isKVertex } from "./utils";

type ModelType = {
    position: KPoint3d;
    inferenceEntity: KFace | KEdge | KAuxiliaryBoundedCurve | KVertex | KAuxiliaryLine | KGroupInstance;
    normal?: KVector3d;
    direction?: KVector3d;
    path: KGroupInstance[];
    tempShapeId?: string;
}

enum Stage {
    PickUpModel = 0,
    PickUpTarget = 1,
}

export class PatchMakeGroupTool implements KTool {
    private stage: Stage = Stage.PickUpModel;
    private model?: ModelType;
    private targetModel?: ModelType;
    // private pathPointPoses: PathPointPose[] = [];
    // private totalLength: number = 0;
    onToolActive(): void {
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

    onToolDeactive(): void {
        const pluginUI = app.getPluginUI();
        this.tryCommit();
        pluginUI.postMessage({ type: 'leaveAlignTool' }, '*');
        this.clear();
        // const toolHelper = app.getToolHelper();
        // toolHelper.enablePicking(false);
        // toolHelper.setDefaultSelectBehavior(KSelectBehavior.REPLACE);
    }
    onMouseMove(event: KMouseEvent, inferenceResult?: KInferenceResult): void {
        const entity = inferenceResult?.entity;
        console.log(entity);
        const appView = app.getActiveView();
        const curModel = this.stage === Stage.PickUpModel ? this.model : this.targetModel;
        if (entity) {
            const transform = inferenceResult.instancePath.reduce<KMatrix4>((acc, instance) => {
                acc.multiply(instance.getTransform());
                return acc;
            }, GeomLib.createIdentityMatrix4());

            let inferenceModel: ModelType | undefined
            if (isKFace(entity)) {
                const surface = entity.getSurface();
                if (isKPlane(surface)) {
                    if (!isKFace(curModel?.inferenceEntity) || curModel?.inferenceEntity.getKey() !== entity.getKey()) {
                        const normal = inferenceResult.normal;
                        // const normal = surface.normal.appliedMatrix4(transform);
                        const faceVertexPoints: KPoint3d[] = [];
                        entity.getVertices().forEach(vertex => {
                            const point = vertex.getPoint();
                            if (point) {
                                faceVertexPoints.push(point.appliedMatrix4(transform));
                            }
                        });
                        inferenceModel = { position: inferenceResult.position, inferenceEntity: entity, normal, path: inferenceResult.instancePath };
                        if (curModel?.tempShapeId) {
                            appView.clearTemporaryShapesByIds([curModel.tempShapeId]);
                        }
                        if (faceVertexPoints.length > 1) {
                            faceVertexPoints.push(faceVertexPoints[0]);
                            const tempShapeId = appView.drawFlatLines(
                                [faceVertexPoints],
                                {
                                    color: { r: 255, g: 0, b: 0 },
                                    pattern: KLinePattern.Solid,
                                    gapSize: 0,
                                }
                            )?.ids[0];
                            inferenceModel.tempShapeId = tempShapeId;
                        }
                        if (this.stage === Stage.PickUpModel) {
                            this.model = inferenceModel;
                        } else {
                            this.targetModel = inferenceModel;
                        }
                        return;
                    }
                    curModel.position = inferenceResult.position;
                    return;
                }
            } else if (isKEdge(entity)) {
                const p0 = entity.getVertexA()?.getPoint();
                const p1 = entity.getVertexB()?.getPoint();
                if (p0 && p1) {
                    if (!isKEdge(curModel?.inferenceEntity) || curModel?.inferenceEntity.getKey() !== entity.getKey()) {
                        const points: KPoint3d[] = [p0.appliedMatrix4(transform), p1.appliedMatrix4(transform)];
                        const direction = points[1].subtracted(points[0]);
                        inferenceModel = { position: inferenceResult.position, inferenceEntity: entity, direction, path: inferenceResult.instancePath, };
                        if (curModel?.tempShapeId) {
                            appView.clearTemporaryShapesByIds([curModel.tempShapeId]);
                        }
                        const tempShapeId = appView.drawFlatLines(
                            [points],
                            {
                                color: { r: 255, g: 0, b: 0 },
                                pattern: KLinePattern.Solid,
                                gapSize: 0,
                            }
                        )?.ids[0];
                        inferenceModel.tempShapeId = tempShapeId;
                        if (this.stage === Stage.PickUpModel) {
                            this.model = inferenceModel;
                        } else {
                            this.targetModel = inferenceModel;
                        }
                        return;
                    }
                    curModel.position = inferenceResult.position;
                    return;
                }
            } else if (isKVertex(entity)) {
                const p0 = entity.getPoint();
                if (p0) {
                    if (!isKVertex(curModel?.inferenceEntity) || !curModel?.inferenceEntity.getPoint()?.isEqual(p0)) {
                        inferenceModel = { position: inferenceResult.position, inferenceEntity: entity, path: inferenceResult.instancePath, };
                        if (curModel?.tempShapeId) {
                            appView.clearTemporaryShapesByIds([curModel.tempShapeId]);
                        }
                        const tempShapeId = appView.drawPoints(
                            [p0.appliedMatrix4(transform)],
                            {
                                color: { r: 255, g: 0, b: 0 },
                            }
                        )?.id;
                        inferenceModel.tempShapeId = tempShapeId;
                        if (this.stage === Stage.PickUpModel) {
                            this.model = inferenceModel;
                        } else {
                            this.targetModel = inferenceModel;
                        }
                        return;
                    }
                    curModel.position = inferenceResult.position;
                    return;
                }
            } else if (isKAuxiliaryBoundedCurve(entity)) {
                const boundedCurve = entity.getBoundedCurve();
                if (isKArc3d(boundedCurve)) {
                    const curvePoints = boundedCurve.getApproximatePointsByAngle();
                    if (curvePoints.length) {
                        if (!isKAuxiliaryBoundedCurve(curModel?.inferenceEntity) || curModel?.inferenceEntity.getKey() !== entity.getKey()) {
                            const points: KPoint3d[] = curvePoints.map(p => p.appliedMatrix4(transform));
                            const normal = boundedCurve.normal.appliedMatrix4(transform).normalized();
                            inferenceModel = { position: inferenceResult.position, inferenceEntity: entity, normal, path: inferenceResult.instancePath, };
                            if (curModel?.tempShapeId) {
                                appView.clearTemporaryShapesByIds([curModel.tempShapeId]);
                            }
                            const tempShapeId = appView.drawFlatLines(
                                [points],
                                {
                                    color: { r: 255, g: 0, b: 0 },
                                    pattern: KLinePattern.Solid,
                                    gapSize: 0,
                                }
                            )?.ids[0];
                            inferenceModel.tempShapeId = tempShapeId;
                            if (this.stage === Stage.PickUpModel) {
                                this.model = inferenceModel;
                            } else {
                                this.targetModel = inferenceModel;
                            }
                            return;
                        }
                        curModel.position = inferenceResult.position;
                        return;
                    }
                } else {
                    const p0 = entity.getStartVertex()?.getPoint();
                    const p1 = entity.getEndVertex()?.getPoint();
                    if (p0 && p1) {
                        if (!isKAuxiliaryBoundedCurve(curModel?.inferenceEntity) || curModel?.inferenceEntity.getKey() !== entity.getKey()) {
                            const points: KPoint3d[] = [p0.appliedMatrix4(transform), p1.appliedMatrix4(transform)];
                            const direction = points[1].subtracted(points[0]);
                            inferenceModel = { position: inferenceResult.position, inferenceEntity: entity, direction, path: inferenceResult.instancePath, };
                            if (curModel?.tempShapeId) {
                                appView.clearTemporaryShapesByIds([curModel.tempShapeId]);
                            }
                            const tempShapeId = appView.drawFlatLines(
                                [points],
                                {
                                    color: { r: 255, g: 0, b: 0 },
                                    pattern: KLinePattern.Solid,
                                    gapSize: 0,
                                }
                            )?.ids[0];
                            inferenceModel.tempShapeId = tempShapeId;
                            if (this.stage === Stage.PickUpModel) {
                                this.model = inferenceModel;
                            } else {
                                this.targetModel = inferenceModel;
                            }
                            return;
                        }
                        curModel.position = inferenceResult.position;
                        return;
                    }
                }
            } else if (isKAuxiliaryLine(entity)) {
                const line = entity.getLine();

                if (!isKAuxiliaryLine(curModel?.inferenceEntity) || curModel?.inferenceEntity.getKey() !== entity.getKey()) {
                    const { direction: lineDirection, origin } = line;
                    const points: KPoint3d[] = [origin.added(lineDirection.multiplied(100000)).appliedMatrix4(transform), origin.added(lineDirection.multiplied(-100000)).appliedMatrix4(transform)];
                    const direction = points[1].subtracted(points[0]);
                    inferenceModel = { position: inferenceResult.position, inferenceEntity: entity, direction, path: inferenceResult.instancePath, };
                    if (curModel?.tempShapeId) {
                        appView.clearTemporaryShapesByIds([curModel.tempShapeId]);
                    }
                    const tempShapeId = appView.drawFlatLines(
                        [points],
                        {
                            color: { r: 255, g: 0, b: 0 },
                            pattern: KLinePattern.Solid,
                            gapSize: 0,
                        }
                    )?.ids[0];
                    inferenceModel.tempShapeId = tempShapeId;
                    if (this.stage === Stage.PickUpModel) {
                        this.model = inferenceModel;
                    } else {
                        this.targetModel = inferenceModel;
                    }
                    return;
                }
                curModel.position = inferenceResult.position;
                return;

            } else if (isKGroupInstance(entity)) {

            }
        }
        if (curModel?.tempShapeId) {
            appView.clearTemporaryShapesByIds([curModel.tempShapeId]);
        }
        if (this.stage === Stage.PickUpModel) {
            this.model = undefined;
        } else {
            this.targetModel = undefined;
        }
    }
    onLButtonUp(event: KMouseEvent, inferenceResult?: KInferenceResult): void {
        if (this.stage === Stage.PickUpModel) {
            if (this.model) {
                this.stage = Stage.PickUpTarget;
            }
        } else {
            if (this.targetModel) {
                app.deactivateCustomTool(this);
            }
        }
    }

    private tryCommit() {
        if (this.model && this.targetModel) {
            const design = app.getActiveDesign();
            const editPath = design.getEditPath();
            const editTransform = editPath.reduce<KMatrix4>((acc, instance) => {
                acc.multiply(instance.getTransform());
                return acc;
            }, GeomLib.createIdentityMatrix4());
            const { position: modelPosition, inferenceEntity: modelEntity, normal: modelNormal, direction: modelDirection, path: modelPath } = this.model;
            const { position: targetPosition, normal: targetNormal, direction: targetDirection } = this.targetModel;
            const mat = editTransform.inversed().multiplied(GeomLib.createTranslationMatrix4(targetPosition.x - modelPosition.x, targetPosition.y - modelPosition.y, targetPosition.z - modelPosition.z))
            const targetNormalReverse = targetNormal?.reversed();
            if (targetNormalReverse) {
                if (modelNormal && !modelNormal.isParallel(targetNormalReverse)) {
                    const crossVec = modelNormal.cross(targetNormalReverse).normalized();
                    const angel = modelNormal.angleTo(targetNormalReverse, crossVec);
                    const rotateMatrix = GeomLib.createRotateMatrix4(angel, crossVec, this.model.position);
                    mat.multiply(rotateMatrix);
                } else if (modelDirection && !modelDirection.isPerpendicular(targetNormalReverse)) {
                    const crossVec1 = modelDirection.cross(targetNormalReverse).normalized();
                    const angel1 = modelDirection.angleTo(targetNormalReverse, crossVec1);
                    const rotateMatrix1 = GeomLib.createRotateMatrix4(angel1 - Math.PI / 2 * (angel1 > Math.PI ? 3 : 1), crossVec1, this.model.position);
                    mat.multiply(rotateMatrix1);
                }
            } else if (targetDirection) {
                if (modelNormal && !modelNormal.isPerpendicular(targetDirection)) {
                    const crossVec2 = modelNormal.cross(targetDirection).normalized();
                    const angel2 = modelNormal.angleTo(targetDirection, crossVec2);
                    const rotateMatrix1 = GeomLib.createRotateMatrix4(angel2 - Math.PI / 2 * (angel2 > Math.PI ? 3 : 1), crossVec2, this.model.position);
                    mat.multiply(rotateMatrix1);
                } else if (modelDirection && !modelDirection.isParallel(targetDirection)) {
                    const crossVec3 = modelDirection.cross(targetDirection).normalized();
                    const angel3 = modelDirection.angleTo(targetDirection, crossVec3);
                    const rotateMatrix1 = GeomLib.createRotateMatrix4(angel3 - Math.PI / 2 * (angel3 > Math.PI ? 3 : 1), crossVec3, this.model.position);
                    mat.multiply(rotateMatrix1);
                }
            }
            mat.multiply(editTransform);
            const targetToTransform = modelPath.find(instance => !editPath.some(ins => ins.getKey() === instance.getKey())) || modelEntity;
            let transformSuccess: boolean = false;
            if (isKFace(targetToTransform) || isKEdge(targetToTransform)) {
                const shell = targetToTransform.getShell();
                if (shell) {
                    transformSuccess = design.transformShells([shell], mat).isSuccess;
                }

            } else if (isKVertex(targetToTransform)) {
                const shell = targetToTransform.getEdges()[0].getShell();
                if (shell) {
                    transformSuccess = design.transformShells([shell], mat).isSuccess;
                }
            } else if (isKAuxiliaryBoundedCurve(targetToTransform) || isKAuxiliaryLine(targetToTransform)) {
                transformSuccess = design.transformAuxiliaryCurves([targetToTransform], mat).isSuccess;
            } else if (isKGroupInstance(targetToTransform)) {
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

    private clear() {
        const appView = app.getActiveView();
        appView.clearTemporaryShapes();
        this.model = undefined;
        this.targetModel = undefined;
        this.stage = Stage.PickUpModel;
    }

    onRButtonUp(event: KMouseEvent, inferenceResult?: KInferenceResult): void {
        app.deactivateCustomTool(this);
    }
    onLButtonDbClick(event: KMouseEvent, inferenceResult?: KInferenceResult): void {
        ;
    }
    allowUsingInference(): boolean {
        return true;
    }
    onKeyDown(event: KKeyBoardEvent): void {
        ;
    }
    onKeyUp(event: KKeyBoardEvent): void {
        ;
    }
}

export const patchMakeGroupTool = new PatchMakeGroupTool();
export function patchMakeGroup() {
    const design = app.getActiveDesign();
    const selection = app.getSelection();
    const allEntities = selection.getAllEntities();
    // const shells: Set<KShell> = new Set();
    // const shellFaces: Map<KShell, KFace[]> = new Map();
    const allFaces: KFace[] = [];
    for (const entity of allEntities) {
        if (isKFace(entity)) {
            allFaces.push(entity);
            // const shell = entity.getShell();
            // if (shell) {
            //     let theFaces = shellFaces.get(shell);
            //     if (!theFaces) {
            //         theFaces = [];
            //         shellFaces.set(shell, theFaces);
            //     }
            //     theFaces.push(entity);
            // }
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