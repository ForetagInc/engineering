set -x isLocal true
set -gx EDITOR nano

function fish_greeting
end

function fish_prompt
    printf '%s %s%s%s > ' $USER \
        (set_color $fish_color_cwd) (prompt_pwd) (set_color normal)
end

starship init fish | source
