import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) return undefined;

    if (data) {
      return (request.user as unknown as Record<string, unknown>)[data];
    }

    return request.user;
  },
);