//////////////////////////////////////////////////////////////////////////
///*				   			 THREAD								  *///
/// 				   		  										   ///
///		    This will handle all thread-related work operations.	   ///
/// 				   		  										   ///
//////////////////////////////////////////////////////////////////////////

const MainMutex = new Mutex();
const Tasks = (() => {
    const queue = [];
    let thread = false;
    let isRunning = false;

    return {
        Push: function (fun) {
            queue.push(() => {
                MainMutex.lock();
                try {
                    fun();
                } catch (e) {
                    xlog(e);
                } finally {
                    MainMutex.unlock();
                    isRunning = false;
                }
            });
        },

        Process: function () {
            if (isRunning || (queue.length === 0)) return;
            isRunning = true;
            const fun = queue.shift();
            thread = Threads.new(fun);
            thread.start();
        },

        get isRunning() { return isRunning; },
        get length() { return queue.length; }
    };
})();
