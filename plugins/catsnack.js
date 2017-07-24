exports.commands = [
  "catsnack"
]

exports.catsnack = {
  "description": "Give a food to our cat",
  "exec": function(bot, metadata) {
    var rand = Math.floor((Math.random() * 10) + 1);
    var msg = "";
    switch (rand) {
      case 1:
      msg = "Meow!";
      break;
      case 2:
      msg = "Yummy!";
      break;
      case 3:
      msg = "Tak málo? Pffft. Naval ještě, " + metadata.user + "!";
      break;
      case 4:
      msg = "Granule? To žrát nebudu, já chci kapsičku s tuňákem!";
      break;
      case 5:
      msg = "*vyžírá misku jak zběsilá*";
      break;
      case 6:
      msg = "Purrrrrrrrrrrrrrr.....";
      break;
      case 7:
      msg = "JSEM Z VENUŠE A GRANULE JSOU POD MOJÍ ÚROVEŇ !!!";
      break;
      case 8:
      msg = "https://memeyourfriends.com/wp-content/uploads/2016/09/hungry-cat-ate-all-my-loaf.jpg"
      break;
      default:
      msg = "Díky, mňauky!";
    }
    bot.sendMessage({
      to: metadata.channelID,
      message: msg
    });
    console.log("I got food from %s in %s (index: %s)", metadata.user, metadata.channelID, rand);
  }
};
