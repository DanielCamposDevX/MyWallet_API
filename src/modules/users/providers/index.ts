import { container } from "tsyringe";
import { BCryptHashProvider } from "./HashProvider/implementations/BCryptHashProvider.js";
import { IHashProvider } from "./HashProvider/models/IHashProvider.js";

container.registerSingleton<IHashProvider>("HashProvider", BCryptHashProvider);
