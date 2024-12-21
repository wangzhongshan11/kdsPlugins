
export function isKArchFace(entity: KEntity | KArchFace | undefined | null): entity is KArchFace {
    return !!entity && (entity.getType() === KArchFaceType.NonPlanar || entity.getType() === KArchFaceType.Planar);
}

export function isKGroupInstance(entity: KEntity | KArchFace | undefined | null): entity is KGroupInstance {
    return !!entity && entity.getType() === KEntityType.GroupInstance;
}

export function isKFace(entity: KEntity | KArchFace | undefined | null): entity is KFace {
    return !!entity && entity.getType() === KEntityType.Face;
}

export function isKEdge(entity: KEntity | KArchFace | undefined | null): entity is KEdge {
    return !!entity && entity.getType() === KEntityType.Edge;
}

export function isKVertex(entity: KEntity | KArchFace | undefined | null): entity is KVertex {
    return !!entity && entity.getType() === KEntityType.Vertex;
}

export function isKAuxiliaryBoundedCurve(entity: KEntity | KArchFace | undefined | null): entity is KAuxiliaryBoundedCurve {
    return !!entity && entity.getType() === KEntityType.AuxiliaryBoundedCurve;
}

export function isKAuxiliaryLine(entity: KEntity | KArchFace | undefined | null): entity is KAuxiliaryLine {
    return !!entity && entity.getType() === KEntityType.AuxiliaryLine;
}

export function isKPlane(entity: KSurface | undefined | null): entity is KPlane {
    return !!entity && entity.getType() === KSurfaceType.Plane;
}

export function isKLineSegment3d(entity: KBoundedCurve3d | undefined | null): entity is KLineSegment3d {
    return !!entity && !!(entity as KLineSegment3d).direction;
}

export function isKArc3d(entity: KBoundedCurve3d | undefined | null): entity is KArc3d {
    return !!entity && !!(entity as KArc3d).circle;
}

export function groupFacesByConnection(faces: KFace[]) {
    if (faces.length < 2) {
        return [faces];
    }
    const edgeFaceIds: Map<string, string[]> = new Map();
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
    }, new Map<string, number>());

    const fineParent = (ind: number) => {
        let theInd = ind;
        let p = parents[ind];
        while (p !== theInd) {
            theInd = p;
            p = parents[theInd];
        }
        return p;
    }

    const union = (ind1: number, ind2: number) => {
        const p1 = fineParent(ind1);
        const p2 = fineParent(ind2);
        const r1 = ranks[p1];
        const r2 = ranks[p2];
        if (r1 < r2) {
            parents[p1] = p2;
        } else {
            parents[p2] = p1;
            if (r1 === r2) {
                ranks[p1] += 1;
            }
        }
    }

    const adjFaceMap: Map<number, Set<number>> = new Map();
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

    const ps = new Map<number, KFace[]>();
    for (let i = 0; i < faces.length; i++) {
        const parentInd = fineParent(i);
        let patchFaces = ps.get(parentInd);
        if (!patchFaces) {
            patchFaces = [];
            ps.set(parentInd, patchFaces);
        }
        patchFaces.push(faces[i]);
    }
    const result: KFace[][] = [];
    for (const [, patch] of ps) {
        result.push(patch);
    }
    return result;
}