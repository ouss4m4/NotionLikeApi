export type ControllerContext = {
  query?: any;
  body?: any;
  params?: any;
  user?: { id: string; name: string; email: string };
};
