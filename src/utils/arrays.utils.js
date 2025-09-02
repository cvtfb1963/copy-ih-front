export const dividirArray = (array, tamanoSubarray) => {
  var subarrays = [];
  for (var i = 0; i < array.length; i += tamanoSubarray) {
    subarrays.push(array.slice(i, i + tamanoSubarray));
  }
  return subarrays;
};
