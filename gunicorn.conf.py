import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'geventwebsocket.gunicorn.workers.GeventWebSocketWorker'
bind = '0.0.0.0:$PORT'

