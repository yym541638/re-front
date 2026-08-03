const childRouter = [
  {
    path: "/RcmFinal",
    name: "RcmFinal",
    meta: {
      name: "RcmFinal",
      cnName: "RcmFinal",
      id: "1428549913133977601",
      requireProject: true,
    },
    component: (resolve) =>
      require(["@/views/longBlade/conditionMonitoring.vue"], resolve),
  },
  // {
  //     path: '/alarmRecord',
  //     name: "alarmRecord",
  //     meta: {
  //         name: "AIgeneratedRcm",
  //         cnName: "RcmFinal"
  //     },
  //     component: resolve => require(["@/views/longBlade/alarmRecord.vue"], resolve),
  // },
  {
    path: "/RcmManual",
    name: "RcmManual",
    meta: {
      name: "RcmManual",
      cnName: "RcmFinal",
    },
    component: (resolve) => require(["@/views/longBlade/details.vue"], resolve),
  },
  {
    path: "/AIGenerate",
    name: "AIGenerate",
    meta: {
      name: "AIGenerate",
      cnName: "RcmFinal",
    },
    component: (resolve) =>
      require(["@/views/longBlade/alarmRecord.Status.vue"], resolve),
  },
  {
    path: "/settingUp",
    name: "settingUp",
    meta: {
      name: "设置",
      cnName: "RcmFinal",
    },
    component: (resolve) =>
      require(["@/views/longBlade/settingUp.vue"], resolve),
  },
];
export default childRouter;
