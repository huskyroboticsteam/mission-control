cd "$(dirname "$0")"

if !(tmux info &> /dev/null) && tmux has-session -t network-stats &> /dev/null; then
	echo "Network session already exists, killing it and restarting!"
	tmux kill-session -t network-stats
fi

tmux new -s network-stats -d
tmux send -t network-stats "python3 network_backend.py$(printf \\r)"
