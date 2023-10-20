import toast from "react-hot-toast";

class Message {
  static Success(message) {
    return toast.success(message);
  }

  static Error(message) {
    return toast.error(message);
  }
}

export default Message;
