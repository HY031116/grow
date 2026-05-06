param(
    [string]$HookEventName = "Unknown"
)

[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)

$null = [Console]::In.ReadToEnd()

$message = @"
Default execution policy: act autonomously, make low-risk decisions independently, and do not stop unless stopping is necessary.

Only stop and ask the user when:
1. A decision materially changes core experience or timeline.
2. The decision is high-risk and irreversible.
3. There is a real blocker that cannot be removed autonomously.
4. The user explicitly asks to stop, wait, or discuss first.

In normal cases, finish the current smallest high-value action and continue toward the next nearest verifiable milestone. Do not stop after a small step just to ask for routine confirmation.

Current hook event: $HookEventName
"@

$result = [ordered]@{
    continue = $true
    systemMessage = $message
}

$result | ConvertTo-Json -Depth 4 -Compress