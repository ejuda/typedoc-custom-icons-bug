import {
  Application,
  PageEvent,
  Reflection,
  DefaultTheme,
  DefaultThemeRenderContext,
  Options,
} from "typedoc";

import { icons as _icons } from "./icon";

/**
 * The theme context is where all of the partials live for rendering a theme,
 * in addition to some helper functions.
 */
export class IconOverrideThemeContext extends DefaultThemeRenderContext {
  constructor(theme: DefaultTheme, options: Options) {
    super(theme, options);

    this.icons = _icons;
  }
}

/**
 * A near clone of the default theme, that adds some custom text after the footer.
 */
export class IconOverrideTheme extends DefaultTheme {
  private _contextCache?: IconOverrideThemeContext;

  render(page: PageEvent<Reflection>): string {
    this.application.logger.info(`Rendering ${page.url}`);
    return super.render(page);
  }

  override getRenderContext(): IconOverrideThemeContext {
    this._contextCache ||= new IconOverrideThemeContext(
      this,
      this.application.options
    );
    return this._contextCache;
  }
}

/**
 * Called by TypeDoc when loading this theme as a plugin. Should be used to define themes which
 * can be selected by the user.
 */
export function load(app: Application) {
  app.renderer.defineTheme("icon-override", IconOverrideTheme);
}
