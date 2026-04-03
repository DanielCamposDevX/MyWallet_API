interface ICreateWorkspaceDTO {
  name: string;
  ownerId: string;
  frequency: "daily" | "weekly" | "monthly";
}

export { ICreateWorkspaceDTO };
