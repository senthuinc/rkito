import { PermissionTypeCode } from "@prisma/client";
import { Router } from "express";
import { validator } from "../../../lib/validator";
import { RBACMiddleware } from "../../../middlewares/rbac.middleware";
import { PillarsController } from "./pillars.controller";
import { PillarsValidationSchema } from "./pillars.validation";

const router: Router = Router();

router
  .route("/")
  .get(
    validator({ querySchema: PillarsValidationSchema.list }),
    RBACMiddleware.instance("rkito.pillar", PermissionTypeCode.READ)
      .RBACAuthorizer,
    PillarsController.instance().list
  );

router
  .route("/:uid")
  .get(
    validator({ urlSchema: PillarsValidationSchema.index }),
    RBACMiddleware.instance("rkito.pillar", PermissionTypeCode.READ)
      .RBACAuthorizer,
    PillarsController.instance().get
  );

router.post(
  "/",
  validator({ bodySchema: PillarsValidationSchema.create }),
  RBACMiddleware.instance("rkito.pillar", PermissionTypeCode.CREATE)
    .RBACAuthorizer,
  PillarsController.instance().create
);

router.patch(
  "/:uid",
  validator({ bodySchema: PillarsValidationSchema.update }),
  RBACMiddleware.instance("rkito.pillar", PermissionTypeCode.CREATE)
    .RBACAuthorizer,
  PillarsController.instance().update
);

router.delete(
  "/:uid",
  validator({ urlSchema: PillarsValidationSchema.delete }),
  RBACMiddleware.instance("rkito.pillar", PermissionTypeCode.DELETE)
    .RBACAuthorizer,
  PillarsController.instance().delete
);

export default router;
