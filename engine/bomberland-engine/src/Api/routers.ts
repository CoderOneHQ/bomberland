import Router from "koa-router";

export interface IServices {}

export const routers: Array<(services: IServices) => Router> = [];
