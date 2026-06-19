import { Pillar, PillarStatusCode, Vision } from "@prisma/client";
import { OrgMetricsComputationService } from "../../dashboard/org-metrics-computation.service";
import { enqueueEmbed } from "../../embeddings/embedding-queue";
import { RequestContext } from "../../../lib/request.context";
import { notNullOrUndefined } from "../../../lib/util";
import { VersionedBaseService } from "../../versioned.base.service";
import { VisionService } from "../vision/vision.service";

export class PillarService extends VersionedBaseService<"pillar"> {
  private static _instance: PillarService;

  private constructor() {
    super("pillar");
  }

  public static instance(): PillarService {
    if (!this._instance) {
      this._instance = new PillarService();
    }
    return this._instance;
  }

  /**searchable fields for this entity */
  protected listSearchContext(searchTerm: string): any {
    return [
      {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    ];
  }

  protected getIncludes(): Record<string, any> | undefined {
    return {
      vision: true,
    };
  }

  public async create(
    rc: RequestContext,
    data: {
      name: string;
      statusCode: PillarStatusCode;
      description: string;
      visionUid: string;
    },
  ): Promise<Vision> {
    if (notNullOrUndefined(data.visionUid)) {
      const vision = await VisionService.instance().findByUid(
        rc,
        data.visionUid,
      );
      if (vision) {
        (<any>data).visionId = vision.id;
      }
    }
    const entity = await super.create(rc, data);
    if ((entity as any).isCurrent !== false) {
      await enqueueEmbed({ orgId: rc.org.id.toString(), entityType: "pillar", entityUid: (entity as any).uid });
    }
    OrgMetricsComputationService.instance().enqueueFor(rc.org.id);
    return entity;
  }

  public async update(
    rc: RequestContext,
    uid: string,
    data: {
      name: string;
      statusCode: PillarStatusCode;
      description: string;
    },
  ): Promise<Pillar> {
    const entity = await super.update(rc, uid, data);
    await enqueueEmbed({ orgId: rc.org.id.toString(), entityType: "pillar", entityUid: entity.uid });
    OrgMetricsComputationService.instance().enqueueFor(rc.org.id);
    return entity;
  }
}
