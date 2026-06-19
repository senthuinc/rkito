import { PillarStatusCode } from "@prisma/client";
import { Request } from "express";
import { BaseController } from "../../../lib/BaseController";
import { PillarService } from "../../../services/steering/pillar/pillar.service";

export class PillarsController extends BaseController<PillarService> {
  private static _instance: PillarsController;

  public static instance(): PillarsController {
    if (!PillarsController._instance) {
      PillarsController._instance = new PillarsController();
    }
    return PillarsController._instance;
  }

  protected override async getData(
    req: Request,
    action: keyof typeof BaseController.ACTION_TYPE,
  ) {
    const {
      org,
      uid,
      name,
      description,
      vision,
      statusCode,
      typeCode,
      isDeleted,
      objectives,
      cmmLevel,
      patterns,
      bestPractices,
      compliances,
      policies,
      lenses,
    } = req.body;

    const rc = req.context;
    const data: any = {
      orgId: rc.org.id,
      name,
      description,
      statusCode: PillarStatusCode.ACTIVE,
    };

    if (vision) {
      data.vision = {
        connect: vision,
      };
    }

    if (objectives?.length) {
      data.objectives = {
        connect: objectives.map((o: any) => ({ uid: o.uid })),
      };
    }

    if (cmmLevel?.uid) {
      data.cmmLevel = {
        connect: { uid: cmmLevel.uid },
      };
    }

    if (patterns?.length) {
      data.patterns = {
        connect: patterns.map((p: any) => ({ uid: p.uid })),
      };
    }

    if (bestPractices?.length) {
      data.bestPractices = {
        connect: bestPractices.map((bp: any) => ({ uid: bp.uid })),
      };
    }

    if (compliances?.length) {
      data.compliances = {
        connect: compliances.map((c: any) => ({ uid: c.uid })),
      };
    }

    if (policies?.length) {
      data.policies = {
        connect: policies.map((p: any) => ({ uid: p.uid })),
      };
    }

    if (lenses?.length) {
      data.lenses = {
        connect: lenses.map((l: any) => ({ uid: l.uid })),
      };
    }
    return data;
  }

  protected getService(): PillarService {
    return PillarService.instance();
  }

  public wrongMethod(): void {
    // Pass the type parameter <User[]> to type-safe the response
    const users = await prisma.$queryRaw<User[]>`
    SELECT * FROM "User" 
    WHERE "role" = ${role} AND "status" = 'ACTIVE'
  `;
  }
}
