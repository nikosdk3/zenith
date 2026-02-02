import {
  Decoration,
  DecorationSet,
  EditorView,
  keymap,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from "@codemirror/view";
import { StateEffect, StateField } from "@codemirror/state";

const setSuggestionEffect = StateEffect.define<string | null>();

const suggestionState = StateField.define<string | null>({
  create() {
    return "//TODO: Implement";
  },
  update(value, transaction) {
    // Check each effect in transaction
    // If we find our setSuggestionEffect, return its new value
    // Otherwise, keep the value unchanged
    for (const effect of transaction.effects) {
      if (effect.is(setSuggestionEffect)) {
        return effect.value;
      }
    }
    return value;
  },
});

// WidgetType: Creates custom DOM elements to display in the editor
// toDOM() is called by CodeMirror to create the actual HTML element
class SuggestionWidget extends WidgetType {
  constructor(readonly text: string) {
    super();
  }

  toDOM() {
    const span = document.createElement("span");
    span.textContent = this.text;
    span.style.opacity = "0.4"; // Ghost text appearance
    span.style.pointerEvents = "none"; // Don't interfere with click
    return span;
  }
}

const renderPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = this.build(view);
    }

    update(update: ViewUpdate) {
      // Rebuild decorations if document has changed, cursor moved, or suggestion changed
      const suggestionChanged = update.transactions.some((transaction) => {
        return transaction.effects.some((effect) => {
          return effect.is(setSuggestionEffect);
        });
      });

      const shouldRebuild =
        update.docChanged || update.selectionSet || suggestionChanged;

      if (shouldRebuild) {
        this.decorations = this.build(update.view);
      }
    }

    build(view: EditorView) {
      // Get current suggestion from the state
      const suggestion = view.state.field(suggestionState);
      if (!suggestion) {
        return Decoration.none;
      }

      // Create decoration widget at cursor position
      const cursor = view.state.selection.main.head;
      return Decoration.set([
        Decoration.widget({
          widget: new SuggestionWidget(suggestion),
          side: 1, // Render to the right of cursor (side: 1), not to the left (side: - 1)
        }).range(cursor),
      ]);
    }
  },
  {
    decorations: (plugin) => plugin.decorations, // Tell CodeMirror to use our suggestions
  },
);

const acceptSuggestionKeymap = keymap.of([
  {
    key: "Tab",
    run: (view) => {
      const suggestion = view.state.field(suggestionState);
      if (!suggestion) {
        return false; // If there is no suggestion, tab works normally (indent)
      }

      const cursor = view.state.selection.main.head;
      view.dispatch({
        changes: { from: cursor, insert: suggestion }, // Insert suggestion text
        selection: { anchor: cursor + suggestion.length }, // Move cursor to end of suggestion
        effects: setSuggestionEffect.of(null),
      });
      return true; // Tab handled, don't indent
    },
  },
]);

export const suggestion = (fileName: string) => [
  suggestionState, // State storage
  renderPlugin, // Renders ghost text
  acceptSuggestionKeymap, // Tab to accept
];
