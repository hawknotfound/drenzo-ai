# Prompt Engineering

The art and science of crafting inputs to get reliable, high-quality outputs from language models.

## First Principles

LLMs predict the next token. Everything flows from that. There's no reasoning engine — just statistical patterns that look like reasoning under certain conditions.

## Core Techniques

- **System prompt:** Highest-level control. Sets persona, rules, constraints, format. Permanent context.
- **Role prompting:** "You are a [role]" — activates domain-specific patterns.
- **Few-shot:** Provide 2-5 examples of desired input-output format.
- **Chain-of-thought (CoT):** "Let's think step by step" — improves reasoning on multi-step problems.
- **Structured output:** Specify JSON, markdown, XML format explicitly.
- **Delimiters:** Clearly separate instructions from input: """ or --- or XML tags.
- **Negative prompting:** "Do not include X" — less reliable, better to specify what TO do.

## Advanced Patterns

- **Tree-of-thought:** Branch and evaluate multiple reasoning paths
- **Reflection:** Have the model critique its own output, then revise
- **Persona chains:** Multiple role views on the same problem
- **Iterative refinement:** Generate, review, improve in multiple turns
- **Meta-prompting:** Prompt the model to write a prompt for itself

## Common Failures

- Vague instructions → vague outputs
- Over-specification → constrained/robotic responses
- Position bias — model focuses on start/end of long prompts
- Recency bias — last instructions weighted more heavily
- Format request ignored — use explicit structuring
