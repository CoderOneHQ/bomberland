# Contributing

## How to submit a contribution

Guideline for creating a great contribution!

1. Create an issue (if the bug / feature is not already tracked) so the community can discuss and de duplicate work.
1. Submit your pr tagging the issue. Ensure the validation build passes (if making engine changes)
1. Once approved by a maintainer your changes will be merged.

## Guidelines for creating a starter template

Contributions for Bomberland starter kits in other languages (as well improvements to existing starter kits) are welcome!

Starter kits in new languages should implement the simulation logic for handling game state updates (see [example](https://github.com/CoderOneHQ/starter-kits/blob/master/python3/game_state.py)) and follow the [validation schema](https://github.com/CoderOneHQ/bomberland/blob/master/engine/bomberland-engine/src/validation.schema.json). The validation schema is the exact object the engine uses to validate all incoming packets. Any packets that do not match that format are automatically rejected.

## How to get help

For any help, please contact us directly on [Discord](https://discord.gg/Hd8TRFKsDa) or via [email](mailto:humans@gocoder.one).
