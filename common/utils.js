export function getDeviceUUID() {
	let uuid = uni.getStorageSync('uni_uuid') ||
		uni.getSystemInfoSync().uuid ||
		uni.getSystemInfoSync().system + '_' + Math.random().toString(36).substr(2);

	uni.setStorageSync('uni_uuid', uuid)
	return uuid;
}
