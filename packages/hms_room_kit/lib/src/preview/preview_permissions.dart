///Dart imports
library;

import 'dart:io';

///Package imports
import 'package:flutter/material.dart';

/// Project imports
import 'package:hms_room_kit/src/common/utility_functions.dart';
import 'package:hms_room_kit/src/hms_prebuilt_options.dart';

/// This renders the preview permissions screen
class PreviewPermissions extends StatefulWidget {
  final HMSPrebuiltOptions? options;
  final void Function() callback;

  const PreviewPermissions({super.key, this.options, required this.callback});

  @override
  State<PreviewPermissions> createState() => _PreviewPermissionsState();
}

class _PreviewPermissionsState extends State<PreviewPermissions> {
  bool _isLoading = false;

  void _getPermissions() async {
    setState(() {
      _isLoading = true;
    });

    var res = await Utilities.getPermissions();

    if (res) {
      widget.callback();
    } else {
      // Show error message if permissions are denied
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Please grant all the above permissions manually by going into your device settings and then retry again"),
        ),
      );
    }

    setState(() {
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      backgroundColor: Colors.grey.shade200, // Set a light gray background
      body: Center(
        child: Container(
          width: size.width * 0.9,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          decoration: BoxDecoration(
            color: Colors.white, // Set container color to white
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1), // Subtle shadow
                blurRadius: 8,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircleAvatar(
                radius: 40,
                backgroundColor: Colors.grey.shade300,
                child: const Icon(
                  Icons.lock,
                  size: 36,
                  color: Colors.black54,
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                "Enable Permissions to Start Your Class",
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              const Text(
                "To use Spardha Classroom, please grant access to:",
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.black87,
                ),
                textAlign: TextAlign.center,
              ),
              if (Platform.isIOS)
                _buildPermissionItem(
                    "Bluetooth", "For seamless device connectivity"),
              const SizedBox(height: 8),
              _buildPermissionItem(
                  "Camera", "To be visible during the session"),
              const SizedBox(height: 8),
              _buildPermissionItem(
                  "Microphone", "To communicate with your teacher"),
              const SizedBox(height: 16),
              const Text(
                "Tap \"Continue\" to enable these permissions and start your session.",
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.black87,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _getPermissions,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: _isLoading
                      ? const CircularProgressIndicator(
                          color: Colors.white,
                        )
                      : const Text(
                          "Continue",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPermissionItem(String title, String description) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "• ",
          style: TextStyle(
            fontSize: 14,
            color: Colors.black87,
          ),
        ),
        Expanded(
          child: RichText(
            text: TextSpan(
              children: [
                TextSpan(
                  text: "$title – ",
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
                TextSpan(
                  text: description,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Colors.black87,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
