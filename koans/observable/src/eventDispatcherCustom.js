var SAMURAIPRINCIPLE = {};

SAMURAIPRINCIPLE.eventDispatcher = function (base) {
	// array of listeners
	base.eventListeners = [];
	// event listener
	base.addEventListener = function() {
		if(arguments.length == 1) {
			base.addEventListener('default', arguments[0], 0);
		}
		else if(arguments.length == 2) {
			base.addEventListener(arguments[0], arguments[1], 0);
		}
		else {
			var newListener = { eventType:arguments[0], listener:arguments[1], priority:arguments[2] };
			if(base.eventListeners.length == 0 || base.eventListeners[base.eventListeners.length-1].priority >= arguments[2]) {
				base.eventListeners.push(newListener);
			}
			else {
				var i;
				for(i=0; i<base.eventListeners.length; i++) {
					// if you hit smaller priority OR end of array
					// this means listeners with same priority are added in order of invocation
					if(arguments[2] > base.eventListeners[i].priority) {
						base.eventListeners.splice(i, 0, newListener);
						break;	// stop executing after you find the first smaller item
					}
				}
			}
		}
	};
	// listner
	base.listener = function() {
		return base.eventListeners.length > 0 ? base.eventListeners[0].listener : undefined;
	};
	// dispatch event
	base.dispatchEvent = function() {

		executeListeners = function(eventType, param, ignoreErrors) {
			var i;
			for(i=0; i<base.eventListeners.length; i++) {
				if(ignoreErrors || base.eventListeners[i].eventType === eventType) {
					try {
						if(base.eventListeners[i].listener(param) === false) {	// if false returned, stop executing
							break;
						}
					}
					catch(error) {
						if(ignoreErrors) {
							executeListeners(eventType, param, true);
							break;
						}
					}
				}
			}
		}

		if(arguments.length == 1) {
			base.dispatchEvent('default', arguments[0]);
		}
		else {
			executeListeners(arguments[0],arguments[1],false)
		}
	};

	base.createObservableProperty = function(prop) {
		var value;	// "private"
		base['on' + prop + 'Changed'] = base.addEventListener.bind(base, prop + 'changed');
		base['set' + prop] = function(param) {
			value = param;
			base.dispatchEvent(prop + 'changed',param);
		};
		base['get' + prop] = function() {
			return value;
		};
	};

	return base;
};