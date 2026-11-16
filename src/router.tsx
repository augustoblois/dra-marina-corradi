import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// O modelo do Lovable criava um QueryClient (React Query) para o contexto do
// roteador, mas a página não faz nenhuma consulta: saiu, e com ele uns 13 KB de
// JavaScript que rodavam antes da primeira pintura.
export const getRouter = () =>
  createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });
