import Router from "koa-router";

interface IServices {}

export const routers: Array<(services: IServices) => Router> = [];
