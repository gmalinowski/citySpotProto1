// Import and register all your controllers from the importmap via controllers/**/*_controller
import { stimulus } from "./stimulus"


import CopyController from "./copy_controller";
stimulus.register("copy", CopyController);

import MapController from './map_controller';
stimulus.register("map", MapController);