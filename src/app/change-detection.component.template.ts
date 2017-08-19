export function template(children: string): string {
  return `
        {{touch}}
        <div class="state">
          <span class="strategy-box {{cdStrategyName}}">{{cdStrategyName}}</span>
          <span #cd_state_box class="cd-state-box"></span>
          <span #ng_do_check_box class="ng-do-check-box">ngDoCheck</span>
          <span #ng_on_changes_box class="ng-on-changes-box">ngOnChanges</span>
        </div>
        <div class="name">{{name}}</div>
        <table class="input-box">
          <tr><th>ByVal:</th><td class="input-value">{{inputByVal}}</td></tr>
          <tr><th>ByRef:</th><td class="input-value">{{inputByRef?.value}}</td></tr>
          <tr><th>Observable:</th><td class="input-value">{{inputObservableValue}}</td></tr>
        </table>
        <div class="control">
          <button #dc_button title="Detect changes">DC</button>
          <button #mfc_button title="Mark for check (only applicable for 'OnPush' strategy; does not trigger change detection)">MFC</button>
          <button #detach_button title="Detaches ChangeDetector">Detach</button>
          <button #attach_button title="Attaches ChangeDetector">Attach</button>
          <button (click)="onClick()" title="Simple click action from template (ng binding)">Click</button>
        </div>
        <div class="children">
          ${children}
        </div>`;
}
