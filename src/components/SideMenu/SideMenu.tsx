import { observer } from 'mobx-react';
import * as React from 'react';

import { IMenuItem, MenuStore } from '../../services/MenuStore';
import { MenuItems } from './MenuItems';

import { PerfectScrollbarWrap } from '../../common-elements/perfect-scrollbar';
import { RedocAttribution } from './styled.elements';

@observer
export class SideMenu extends React.Component<{ menu: MenuStore; className?: string }> {
  private _updateScroll?: () => void;

  render() {
    const store = this.props.menu;
    return (
      <PerfectScrollbarWrap
        updateFn={this.saveScrollUpdate}
        className={this.props.className}
        options={{
          wheelPropagation: false,
        }}
      >
        <MenuItems items={store.items} onActivate={this.activate} root={true} />
        <RedocAttribution>© 2019 EMQ LIMITED / ALL RIGHTS RESERVED</RedocAttribution>
      </PerfectScrollbarWrap>
    );
  }

  activate = (item: IMenuItem) => {
    if (item.expanded && (item.type === 'tag' || (item.type === 'section' && item.depth === 1))) {
      this.props.menu.deactivateTagAndSection(item);
    } else {
      this.props.menu.activateAndScroll(item, true);
      setTimeout(() => {
        if (this._updateScroll) {
          this._updateScroll();
        }
      });
    }
  };

  private saveScrollUpdate = upd => {
    this._updateScroll = upd;
  };
}
